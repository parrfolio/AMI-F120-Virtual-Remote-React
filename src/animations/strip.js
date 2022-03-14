const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");

function Strip() {
  let ledCount = 300;

  let channels = ws281x.init({
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

  // gpio: 19 works as well

  this.offset = 0;
  //channel 1 strips on GPIO 18
  this.colorsArray1 = (...channels) => channels[0].array;

  //channel 2 strips on GPIO 13
  this.colorsArray2 = (...channels) => channels[1].array;
}
module.exports = {
  Strip: Strip,
};
