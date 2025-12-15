const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common.cjs");
const { RecurringTimer } = require("./timer.cjs");
const { Strip } = require("./strip.cjs");

let activeStrips = [];

function Xmas(config) {
  activeStrips = config;
  // console.log(config);
  activeStrips.forEach((item) => {
    let offset = 0;
    let DanceWidth = 15;
    let DanceArray = [];
    let XmasIterateSpeed = 75;
    let XmasIterateOffset = 0;
    let leds = common.num_leds();
    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function () {
      for (let i = item.start; i < item.stop; i++) {
        // simplier xmas style that I need to break out into it's own animation
        //item.stripArray[i] = common.RandomXmasColor();
        for (var d = 0; d < DanceWidth; d++) {
          DanceArray[d] = common.RandomXmasColor();
        }

        let DanceArrayIndex = 0;
        let x = 0 + XmasIterateOffset;
        for (x; x < leds; x++) {
          if (DanceArrayIndex < DanceWidth) {
            item.stripArray[i] = DanceArray[DanceArrayIndex];
          }
          DanceArrayIndex++;
        }
        DanceArrayIndex = 0;
        let y = leds - XmasIterateOffset;
        for (y; y > 0; y--) {
          if (DanceArrayIndex < DanceWidth) {
            item.stripArray[i] = DanceArray[DanceArrayIndex];
          }
          DanceArrayIndex++;
        }

        XmasIterateOffset++;
        if (XmasIterateOffset > leds) {
          XmasIterateOffset = 0;
          for (let d = 0; d < DanceWidth; d++) {
            DanceArray[d] = common.RandomXmasColor();
          }
        }
      }

      ws281x.render();
    }, item.delay);
  });
}

function XmasPause() {
  ws281x.reset();
  activeStrips.forEach((item) => {
    if (item.stripTimer) {
      item.stripTimer.pause();
    }
  });
}

module.exports = {
  Xmas: Xmas,
  XmasPause: XmasPause,
};
