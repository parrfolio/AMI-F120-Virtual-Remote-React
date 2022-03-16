const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const timers = require("./timer");
const { Strip } = require("./strip");

let RecurringTimer = timers.RecurringTimer;

// let channel2 = channels[1];
// let colorsArray2 = channel2.array;

function Rainbow(config) {
  let interval = {};
  let strip = {};
  config.forEach((item) => {
    let offset = 0;
    let channelSet = item.channelSet;
    let itemName = item.name;
    console.log(itemName);
    // console.log(item.channelSet);
    // console.log(item.name);

    strip[itemName] = new Strip(item).findStrip();

    itemName = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        console.log(strip[itemName]);
        let name = strip[itemName];
        name[i] = common.colorwheel((offset + i) % 256);
      }
      offset = (offset + 1) % 256;

      ws281x.render();
    }, item.delay);

    this.RainbowPause = function(config) {
      itemName.pause();
    };
  });
}
module.exports = {
  Rainbow: Rainbow,
};
