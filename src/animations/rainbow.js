const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const timers = require("./timer");
const strip = require("./strip");

console.log(strip.colorsArray1());

// let ledCount = 300;
// let channels = ws281x.init({
//   dma: 10,
//   freq: 800000,
//   channels: [
//     {
//       count: ledCount,
//       gpio: 18,
//       invert: false,
//       brightness: 255,
//       stripType: "ws2812",
//     },
//     {
//       count: ledCount,
//       gpio: 13,
//       invert: false,
//       brightness: 255,
//       stripType: "ws2812",
//     },
//   ],
// });

// gpio: 19 works as well

let offset = 0;
//channel 1 strips on GPIO 18
let colorsArray1 = strip.colorsArray1();

//channel 2 strips on GPIO 13
// let channel2 = channels[1];
// let colorsArray2 = channel2.array;

let RecurringTimer = timers.RecurringTimer;

let interval = {};

function Rainbow(config) {
  interval[config.name] = new RecurringTimer(function() {
    for (let i = config.start; i < config.stop; i++) {
      colorsArray1[i] = common.colorwheel((offset + i) % 256);
    }
    offset = (offset + 1) % 256;
    ws281x.render();
  }, config.delay);

  this.RainbowPause = function(config) {
    interval[config.name].pause();
  };
}
module.exports = {
  Rainbow: Rainbow,
};
