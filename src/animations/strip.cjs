const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common.cjs");

// Initialize ws281x at module load time - this runs once when first required
let strips = ws281x.init({
  dma: 10,
  freq: 800000,
  channels: [
    {
      count: common.num_leds(), // 236 LEDs on channel 0
      gpio: 18,
      invert: false,
      brightness: 255,
      stripType: "ws2812",
    },
    {
      count: common.num_leds_channel_01(), // 60 LEDs on channel 1
      gpio: 13,
      invert: false,
      brightness: 255,
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
