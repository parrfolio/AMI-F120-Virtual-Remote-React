const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const timers = require("./timer");
const { Strip } = require("./strip");

let RecurringTimer = timers.RecurringTimer;

// let channel2 = channels[1];
// let colorsArray2 = channel2.array;

function Rainbow(config) {
  config.forEach((item) => {
    let offset = 0;

    console.log(item.name);

    item.name = new Strip(item).findStrip();

    console.log(item.name);

    item.channelSetName = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        item.name[i] = common.colorwheel((offset + i) % 256);
      }
      offset = (offset + 1) % 256;
      ws281x.render();
    }, item.delay);

    this.RainbowPause = function(config) {
      item.channelSetName.pause();
    };
  });
}
module.exports = {
  Rainbow: Rainbow,
};
