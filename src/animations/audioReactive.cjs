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

// Simulated 8-band "audio" (no mic): drift + pulses.
const createBandSimulator = (bandCount = 8) => {
  const phases = Array.from({ length: bandCount }, (_, idx) => idx * 0.73);
  const speeds = Array.from({ length: bandCount }, (_, idx) => 0.6 + idx * 0.12);
  let pulse = 0;

  return (dtSeconds) => {
    // Random kick every ~0.4-1.2s
    pulse -= dtSeconds * 1.8;
    if (pulse < 0 && Math.random() < dtSeconds * 1.2) {
      pulse = 1;
    }

    const bands = phases.map((phase, i) => {
      phases[i] += dtSeconds * speeds[i];
      const slow = (Math.sin(phases[i]) + 1) / 2;
      const mid = (Math.sin(phases[i] * 2.1 + i) + 1) / 2;

      // Emphasize lows slightly like music
      const lowBias = 1 - i / (bandCount - 1);
      const kick = pulse > 0 ? pulse * lowBias : 0;

      const level = 0.15 + slow * 0.35 + mid * 0.35 + kick * 0.6;
      return clamp01(level);
    });

    // decay pulse
    pulse = Math.max(0, pulse - dtSeconds * 2.4);

    return bands;
  };
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
  let last = Date.now();
  let hueOffset = 0;

  timer = new RecurringTimer(function () {
    const now = Date.now();
    const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
    last = now;

    const bands = simulateBands(dt);
    const energy = Math.max(...bands);

    // Slow hue shift; energy slightly accelerates.
    hueOffset = (hueOffset + dt * (0.06 + energy * 0.22)) % 1;

    activeStrips.forEach((item) => {
      const isExtra = item.name === "extra_leds";
      for (let i = item.start; i < item.stop; i++) {
        if (isExtra) {
          item.stripArray[i] = 0x000000;
          continue;
        }

        const pos = (i - item.start) / Math.max(1, item.stop - item.start);
        const bandIndex = Math.min(7, Math.floor(pos * 8));
        const level = bands[bandIndex];

        // Map each band to a different hue region; level controls value.
        const hue = (hueOffset + bandIndex / 10) % 1;
        const sat = 1;
        const val = 0.05 + level * 0.95;

        item.stripArray[i] = hsvToRgbInt(hue, sat, val);
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
