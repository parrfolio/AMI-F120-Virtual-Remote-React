const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
function Strip(config) {
  let channelConfig = config.channelSet;
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
  const findStrip = () => {
    console.log(channelConfig);
    console.log(strips[channelConfig]);
    return strips[channelConfig].array;
  };

  this.findStrip = findStrip;
  this.findStrip();

  let render = () => {
    return ws281x.render();
  };

  this.render = render;
  this.render();
}

module.exports = {
  Strip: Strip,
};
