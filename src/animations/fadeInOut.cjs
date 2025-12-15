const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common.cjs");
const { RecurringTimer } = require("./timer.cjs");
const { Strip } = require("./strip.cjs");

let activeStrips = [];

function FadeInOut(config) {
  activeStrips = config;
  let offset = 0;
  let eyeSize = 12;
  let reversing = false;
  let leds = common.num_leds();

  activeStrips.forEach((item) => {
    item["stripArray"] = new Strip(item).findStrip();
  });

  // Use the first strip's timer to drive the animation for all strips
  if (activeStrips.length > 0) {
    let firstStrip = activeStrips[0];
    firstStrip["stripTimer"] = new RecurringTimer(function () {
      // Update all LEDs across all strips
      activeStrips.forEach((item) => {
        for (let i = item.start; i < item.stop; i++) {
          item.stripArray[i] = common.cylon(
            (offset + i) % leds,
            0xff0000,
            leds,
            eyeSize
          );
        }
      });

      // Move the offset
      if (!reversing) {
        offset++;
        if (offset >= leds - eyeSize) {
          reversing = true;
        }
      } else {
        offset--;
        if (offset <= 0) {
          reversing = false;
        }
      }

      ws281x.render();
    }, firstStrip.delay);
  }
}

function FadeInOutPause() {
  ws281x.reset();
  activeStrips.forEach((item) => {
    if (item.stripTimer) {
      item.stripTimer.pause();
    }
  });
}

module.exports = {
  FadeInOut: FadeInOut,
  FadeInOutPause: FadeInOutPause,
};
