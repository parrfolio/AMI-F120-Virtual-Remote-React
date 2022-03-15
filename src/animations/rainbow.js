const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const timers = require("./timer");
const { Strip } = require("./strip");

let RecurringTimer = timers.RecurringTimer;
let interval = {};

// let channel2 = channels[1];
// let colorsArray2 = channel2.array;

function Rainbow(config) {
  console.log("Channel Set from Config", config.channelSet);
  let channelSet = config.channelSet;
  let colors = {};
  console.log("Channel Set from Color Object", colors[channelSet]);
  let offset = 0;
  let strip = new Strip(config).findStrip();

  config.name = new RecurringTimer(function() {
    for (let i = config.start; i < config.stop; i++) {
      strip[i] = common.colorwheel((offset + i) % 256);
    }
    offset = (offset + 1) % 256;
    ws281x.render();
  }, config.delay);
  this.RainbowPause = function(config) {
    config.name.pause();
  };
}
module.exports = {
  Rainbow: Rainbow,
};
