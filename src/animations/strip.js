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
  let channel1 = channels[0];
  this.colorsArray1 = channel1.array;

  //channel 2 strips on GPIO 13
  let channel2 = channels[1];
  this.colorsArray2 = channel2.array;
}
module.exports = {
  Strip: Strip,
};
