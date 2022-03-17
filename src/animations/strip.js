const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
function Strip(config) {
  console.log(config);
  const ledCount = 332;
  let strips = ws281x.init({
    dma: 10,
    freq: 800000,
    channels: [
      {
        count: ledCount,
        gpio: 18,
        invert: false,
        brightness: config.brightness,
        stripType: "ws2812",
      },
      {
        count: ledCount,
        gpio: 13,
        invert: false,
        brightness: config.brightness,
        stripType: "ws2812",
      },
    ],
  });
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
