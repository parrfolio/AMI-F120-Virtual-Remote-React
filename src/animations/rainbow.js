const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const timers = require("./timer");
const strip = require("./strip");

let RecurringTimer = timers.RecurringTimer;
let interval = {};
let colors = {};

// let channel1 = channels[0];
// let colorsArray1 = channel1.array;

// let channel2 = channels[1];
// let colorsArray2 = channel2.array;

function Rainbow(config) {
  let offset = 0;

  colors[config.name] = strip.FindStrip(config.channel);

  interval[config.name] = new RecurringTimer(function() {
    for (let i = config.start; i < config.stop; i++) {
      colors[config.channel][i] = common.colorwheel((offset + i) % 256);
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
