const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");

const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");
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

var colorsArray1 = function(...channels) {
  return Channel.array;
};
console.log(colorsArray1);

console.log(...channels);
console.log(channels);

let interval = {};

function Rainbow(config) {
  interval[config.name] = new RecurringTimer(function() {
    for (let i = config.start; i < config.stop; i++) {
      Strip.colorsArray1[i] = common.colorwheel((Strip.offset + i) % 256);
    }
    offset = (Strip.offset + 1) % 256;
    ws281x.render();
  }, config.delay);

  this.RainbowPause = function(config) {
    interval[config.name].pause();
  };
}
module.exports = {
  Rainbow: Rainbow,
};
