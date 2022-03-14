const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");

const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");

let interval = {};

function Rainbow(config) {
  console.log(Strip, Strip.colorsArray1, Strip());
  interval[config.name] = new RecurringTimer(function() {
    for (let i = config.start; i < config.stop; i++) {
      Strip.colorsArray1[i] = common.colorwheel((strip.offset + i) % 256);
    }
    offset = (strip.offset + 1) % 256;
    ws281x.render();
  }, config.delay);

  this.RainbowPause = function(config) {
    interval[config.name].pause();
  };
}
module.exports = {
  Rainbow: Rainbow,
};
