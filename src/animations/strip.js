const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const ledCount = 300;
let strips = ws281x.init({
  dma: 10,
  freq: 800000,
  channels: [
    {
      count: ledCount,
      gpio: 18,
      invert: false,
      brightness: 255,
      stripType: "ws2812",
    },
    {
      count: ledCount,
      gpio: 13,
      invert: false,
      brightness: 255,
      stripType: "ws2812",
    },
  ],
});
function Strip(config) {
  console.log(config);
  let channelConfig = config.channelSet;
  console.log(channelConfig);
  const findStrip = () => {
    return strips[channelConfig].array;
  };

  this.findStrip = findStrip;
  this.findStrip();
}

module.exports = {
  Strip: Strip,
};
