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

  var colorsArray1 = function(...channels) {
    return channels[0].array;
  };

  var colorsArray2 = function(...channels) {
    return channels[1].array;
  };

  this.colorsArray1 = colorsArray1;
  this.colorsArray2 = colorsArray2;

  console.log(colorsArray1, colorsArray2);
}
module.exports = {
  Strip: Strip,
};