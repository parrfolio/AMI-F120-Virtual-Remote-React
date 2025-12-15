const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common.cjs");

const clampByte = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(255, Math.round(parsed)));
};

// Default to a conservative brightness to avoid brownouts/resets when many LEDs are white.
// Can be overridden per-machine with LED_BRIGHTNESS=0..255.
const DEFAULT_BRIGHTNESS = 96;
const CHANNEL_BRIGHTNESS = clampByte(process.env.LED_BRIGHTNESS, DEFAULT_BRIGHTNESS);

// Initialize ws281x at module load time - this runs once when first required
let strips = ws281x.init({
  dma: 10,
  freq: 800000,
  channels: [
    {
      count: common.num_leds(), // 236 LEDs on channel 0
      gpio: 18,
      invert: false,
      brightness: CHANNEL_BRIGHTNESS,
      stripType: "ws2812",
    },
    {
      count: common.num_leds_channel_01(), // 60 LEDs on channel 1
      gpio: 13,
      invert: false,
      brightness: CHANNEL_BRIGHTNESS,
      stripType: "ws2812",
    },
  ],
});

function Strip(config) {
  let channelConfig = config.channelSet;

  const findStrip = () => {
    return strips[channelConfig].array;
  };

  this.findStrip = findStrip;
  this.findStrip();
}

module.exports = {
  Strip: Strip,
};
