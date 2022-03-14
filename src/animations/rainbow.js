const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");

const strip = require("./strip");
const common = require("./common");
const timers = require("./timer");

let RecurringTimer = timers.RecurringTimer;

let interval = {};

function Rainbow(config) {
  interval[config.name] = new RecurringTimer(function() {
    for (let i = config.start; i < config.stop; i++) {
      strip.Strip.colorsArray1[i] = common.colorwheel((offset + i) % 256);
    }
    offset = (strip.Strip.offset + 1) % 256;
    strip.Strip.ws281x.render();
  }, config.delay);

  this.RainbowPause = function(config) {
    interval[config.name].pause();
  };
}
module.exports = {
  Rainbow: Rainbow,
};
