const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common.cjs");
const { RecurringTimer } = require("./timer.cjs");
const { Strip } = require("./strip.cjs");

let activeStrips = [];

function Rainbow(config) {
  activeStrips = config;
  activeStrips.forEach((item) => {
    let offset = 0;
    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function () {
      for (let i = item.start; i < item.stop; i++) {
        item.stripArray[i] = common.colorwheel((offset + i) % 256);
      }
      offset = (offset + 1) % 256;
      ws281x.render();
    }, item.delay);
  });
}

function RainbowPause() {
  ws281x.reset();
  activeStrips.forEach((item) => {
    if (item.stripTimer) {
      item.stripTimer.pause();
    }
  });
}

module.exports = {
  Rainbow: Rainbow,
  RainbowPause: RainbowPause,
};
