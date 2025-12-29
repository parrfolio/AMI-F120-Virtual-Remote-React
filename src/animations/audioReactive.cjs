const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common.cjs");
const { RecurringTimer } = require("./timer.cjs");
const { Strip } = require("./strip.cjs");

let activeStrips = [];
let timer = null;

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const hsvToRgbInt = (h, s, v) => {
  // h: 0..1, s: 0..1, v: 0..1
  const hue = ((h % 1) + 1) % 1;
  const sat = clamp01(s);
  const val = clamp01(v);

  const i = Math.floor(hue * 6);
  const f = hue * 6 - i;
  const p = val * (1 - sat);
  const q = val * (1 - f * sat);
  const t = val * (1 - (1 - f) * sat);

  let r = 0,
    g = 0,
    b = 0;
  switch (i % 6) {
    case 0:
      r = val;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = val;
      b = p;
      break;
    case 2:
      r = p;
      g = val;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = val;
      break;
    case 4:
      r = t;
      g = p;
      b = val;
      break;
    case 5:
      r = val;
      g = p;
      b = q;
      break;
  }

  return common.rgb2Int(
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  );
};

const intToRgb = (color) => ({
  r: (color >> 16) & 0xff,
  g: (color >> 8) & 0xff,
  b: color & 0xff,
});

const blendRgbInt = (fromColor, toColor, alpha) => {
  const a = clamp01(alpha);
  const from = intToRgb(fromColor);
  const to = intToRgb(toColor);
  return common.rgb2Int(
    Math.round(from.r + (to.r - from.r) * a),
    Math.round(from.g + (to.g - from.g) * a),
    Math.round(from.b + (to.b - from.b) * a)
  );
};

// Simulated 8-band "audio" (no mic): smooth drift + beat envelope.
const createBandSimulator = (bandCount = 8) => {
  const phases = Array.from({ length: bandCount }, (_, idx) => idx * 0.73);
  const speeds = Array.from(
    { length: bandCount },
    (_, idx) => 0.6 + idx * 0.12
  );
  let beatPhase = 0;
  let beatEnv = 0;

  return (dtSeconds) => {
    // Periodic beat with smooth envelope (less flashing than random kicks)
    // ~110 BPM (1.83 Hz)
    beatPhase = (beatPhase + dtSeconds * 1.83) % 1;
    const beat = Math.max(0, Math.sin(beatPhase * Math.PI));
    // Attack fast, release slower
    beatEnv = Math.max(beatEnv - dtSeconds * 2.2, 0);
    beatEnv = Math.max(beatEnv, beat);

    const bands = phases.map((phase, i) => {
      phases[i] += dtSeconds * speeds[i];
      const slow = (Math.sin(phases[i]) + 1) / 2;
      const mid = (Math.sin(phases[i] * 2.1 + i) + 1) / 2;

      // Emphasize lows slightly like music
      const lowBias = 1 - i / (bandCount - 1);
      const kick = beatEnv * lowBias;

      const level = 0.12 + slow * 0.34 + mid * 0.34 + kick * 0.55;
      return clamp01(level);
    });

    return bands;
  };
};

const lerp = (a, b, t) => a + (b - a) * t;

const sampleBands = (bands, position01) => {
  if (!bands || bands.length === 0) return 0;
  const p = clamp01(position01) * (bands.length - 1);
  const idx = Math.floor(p);
  const frac = p - idx;
  const a = bands[idx] ?? 0;
  const b = bands[Math.min(bands.length - 1, idx + 1)] ?? a;
  return lerp(a, b, frac);
};

function AudioReactive(config) {
  activeStrips = config;

  activeStrips.forEach((item) => {
    item.stripArray = new Strip(item).findStrip();
  });

  // Drive all strips from one timer to avoid render contention.
  const fps = 30;
  const delay = Math.round(1000 / fps);

  const simulateBands = createBandSimulator(8);
  const smoothedBands = new Array(8).fill(0);
  let last = Date.now();
  let t = 0;

  timer = new RecurringTimer(function () {
    const now = Date.now();
    const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
    last = now;

    t += dt;

    const bands = simulateBands(dt);
    // Smooth bands (attack/release) to reduce flashing
    for (let i = 0; i < smoothedBands.length; i++) {
      const target = bands[i] ?? 0;
      const current = smoothedBands[i];
      const attack = 10; // per second
      const release = 3; // per second
      const rate = target > current ? attack : release;
      smoothedBands[i] = lerp(current, target, clamp01(dt * rate));
    }

    const energy = Math.max(...smoothedBands);

    // Flow speed increases with energy
    const flow = t * (0.25 + energy * 0.9);

    activeStrips.forEach((item) => {
      const isExtra = item.name === "extra_leds";
      const length = Math.max(1, item.stop - item.start);
      const stripSeed = (item.channelSet * 97 + item.start * 13) % 1000;

      for (let i = item.start; i < item.stop; i++) {
        if (isExtra) {
          item.stripArray[i] = 0x000000;
          continue;
        }

        const pos = (i - item.start) / length;

        // Continuous "band" sampling across strip so it dances instead of stepping
        const level = sampleBands(smoothedBands, pos);

        // Two waves: one global, one per-strip to create motion
        const w1 = (Math.sin((pos * 2.0 + flow) * Math.PI * 2) + 1) / 2;
        const w2 = (Math.sin((pos * 5.0 - flow * 1.3 + stripSeed / 1000) * Math.PI * 2) + 1) / 2;
        const wave = 0.55 * w1 + 0.45 * w2;

        // Hue gradient that scrolls, with slight energy-based shift
        const hue = (pos * 0.65 + flow * 0.08 + energy * 0.12) % 1;
        const sat = 0.95;

        // Value follows audio and wave; keep a low floor so it never "pops" off
        const val = clamp01(0.08 + level * 0.65 + wave * (0.12 + energy * 0.25));

        const next = hsvToRgbInt(hue, sat, val);

        // Blend frames to smooth transitions (reduces flashing)
        const current = item.stripArray[i] || 0;
        const blendAlpha = 0.28 + energy * 0.18;
        item.stripArray[i] = blendRgbInt(current, next, blendAlpha);
      }
    });

    ws281x.render();
  }, delay);
}

function AudioReactivePause() {
  ws281x.reset();
  if (timer) {
    timer.pause();
    timer = null;
  }
}

module.exports = {
  AudioReactive,
  AudioReactivePause,
};
