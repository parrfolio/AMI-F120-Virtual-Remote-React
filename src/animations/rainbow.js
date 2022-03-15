const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const timers = require("./timer");
const { Strip } = require("./strip");

let RecurringTimer = timers.RecurringTimer;
let interval = {};
let strip = {};

// let channel2 = channels[1];
// let colorsArray2 = channel2.array;

function Rainbow(config) {
  let offset = 0;
  let channelSet = config.channelSet;
  console.log(config.channelSet);
  console.log(config.name);
  strip[config.name] = new Strip(config).findStrip();

  interval[config.name] = new RecurringTimer(function() {
    for (let i = config.start; i < config.stop; i++) {
      strip[config.name][i] = common.colorwheel((offset + i) % 256);
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
