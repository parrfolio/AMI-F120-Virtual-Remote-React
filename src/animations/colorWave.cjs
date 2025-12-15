const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common.cjs");
const { RecurringTimer } = require("./timer.cjs");
const { Strip } = require("./strip.cjs");

let activeStrips = [];

function ColorWave(config) {
  activeStrips = config;

  activeStrips.forEach((item) => {
    let ledIndex = 0;
    let iterationIndex = 0;
    let maxIterations = 256 * 5;
    let leds = common.num_leds();

    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function () {
      for (let i = item.start; i < item.stop; i++) {
        if (iterationIndex < maxIterations) {
          if (ledIndex < leds) {
            item.stripArray[i] = common.colorwheel(
              ((ledIndex * 256) / leds + iterationIndex) & 255
            );
            ledIndex++;
          } else {
            ledIndex = 0;
            iterationIndex++;
          }
        } else {
          ledIndex = 0;
          iterationIndex = 0;
        }
      }
      ws281x.render();
    }, item.delay);
  });
}

function ColorWavePause() {
  ws281x.reset();
  activeStrips.forEach((item) => {
    if (item.stripTimer) {
      item.stripTimer.pause();
    }
  });
}

module.exports = {
  ColorWave: ColorWave,
  ColorWavePause: ColorWavePause,
};
