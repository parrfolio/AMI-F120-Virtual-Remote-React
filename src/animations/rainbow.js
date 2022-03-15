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
  config.forEach((item) => {
    let offset = 0;
    let channelSet = item.channelSet;
    console.log(item.channelSet);
    console.log(item.name);
    strip[item.name] = new Strip(item).findStrip();

    interval[item.name] = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        strip[item.name][i] = common.colorwheel((offset + i) % 256);
      }
      offset = (offset + 1) % 256;
      ws281x.render();
    }, item.delay);

    this.RainbowPause = function(config) {
      interval[item.name].pause();
    };
  });
}
module.exports = {
  Rainbow: Rainbow,
};
