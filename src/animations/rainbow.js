const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const timers = require("./timer");
const strip = require("./strip");

let RecurringTimer = timers.RecurringTimer;
let interval = {};
let colors = {};

function Rainbow(config) {
  let offset = 0;

  let colorwheel = (pos) => {
    pos = 255 - pos;
    if (pos < 85) {
      return rgb2Int(255 - pos * 3, 0, pos * 3);
    } else if (pos < 170) {
      pos -= 85;
      return rgb2Int(0, pos * 3, 255 - pos * 3);
    } else {
      pos -= 170;
      return rgb2Int(pos * 3, 255 - pos * 3, 0);
    }
  };

  let rgb2Int = (r, g, b) => {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
  };

  colors[config.channel] = strip.FindStrip(config.channel);
  interval[config.name] = new RecurringTimer(function() {
    for (let i = config.start; i < config.stop; i++) {
      colors[config.channel][i] = colorwheel((offset + i) % 256);
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
