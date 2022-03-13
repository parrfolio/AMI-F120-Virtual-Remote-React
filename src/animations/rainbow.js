const common = require("./common");
const timers = require("./timer");

let RecurringTimer = timers.RecurringTimer;
let rainbowInterval = null;

function Rainbow(callback, delay) {
  rainbowInterval = new RecurringTimer(function() {
    for (let i = 0; i < 150; i++) {
      colorsArray1[i] = common.colorwheel((offset + i) % 256);
    }
    offset = (offset + 1) % 256;
    ws281x.render();
  }, 1000 / 30);
}

module.exports = {
  Rainbow: Rainbow,
};
