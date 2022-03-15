const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");

function strip() {
  //channel 1 strips on GPIO 18
  //   let channel1 = channels[0];
  //   let colorsArray1 = channel1.array;

  //   //channel 2 strips on GPIO 13
  //   let channel2 = channels[1];
  //   let colorsArray2 = channel2.array;

  //   this.colorsArray1 = colorsArray1;
  //   this.colorsArray2 = colorsArray2;
  // gpio: 19 works as well

  //   this.offset = 0;
  //channel 1 strips on GPIO 18

  //   var colorsArray1 = function(channels) {
  //     return "foo";
  //   };

  //   var colorsArray2 = function(channels) {
  //     return channels[1].array;
  //   };

  this.findStrip = (channel) => {
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
    return strips[channel].array;
  };
}
module.exports = new strip();
