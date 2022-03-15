const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
function Strip(config) {
  let channelConfig = config.channelSet;
  let findStrip = () => {
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
    //console.log("STRIPS ARRAY", strips[channelConfig].array);
    return strips[channelConfig].array;
  };

  this.findStrip = findStrip;
  this.findStrip();

  let Render = () => {
    return ws281x.render();
  };

  this.Render = Render;
}

module.exports = {
  Strip: Strip,
};
