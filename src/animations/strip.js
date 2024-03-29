const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
let strips = ws281x.init({
  dma: 10,
  freq: 800000,
  channels: [
    {
      count: common.num_leds(),
      gpio: 18,
      invert: false,
      brightness: 255,
      stripType: "ws2812",
    },
    {
      count: common.num_leds(),
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

  //   const stripRender = () => {
  //     return ws281x.render();
  //   };

  //   this.stripRender = stripRender;
  //   this.stripRender();
}

module.exports = {
  Strip: Strip,
};
