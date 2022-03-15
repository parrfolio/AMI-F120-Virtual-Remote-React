const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");

function strip() {
  this.FindStrip = (channel) => {
    let ledCount = 300;
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
    console.log(channel);
    return strips[channel].array;
  };

  this.Render = () => {
    ws281x.render();
  };
}
module.exports = new strip();
