const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");
const { fadeinout } = require("./common");

function FadeInOut(config) {
  let strips = config;
  // console.log(config);
  strips.forEach((item) => {
    let offset = item.start;
    let leds = item.stop - item.start;
    let ledsOpp = item.start - item.stop;
    let eyeSize = 15;
    let eyeColor = 0xcc0000;
    let reversing = false;

    const randomIntFromInterval = (min, max) =>
      Math.floor(Math.random() * (max - min + 1) + min);

    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      if (item.name === "title_striplight_2") {
        //item.brightness = 10;

        console.log(offset, offset === 59);
        console.log(offset, offset >= 0);
        if (!reversing) {
          if (offset === 59) {
            reversing = true;
            for (i = item.stop - 1; i > item.start; i--) {
              item.stripArray[i] = common.cylon(
                (offset + i) % leds,
                eyeColor,
                leds,
                eyeSize
              );
            }
            offset = (offset - 1) % leds;
          } else {
            for (i = item.start; i < item.stop; i++) {
              item.stripArray[i] = common.cylon(
                (offset + i) % leds,
                eyeColor,
                leds,
                eyeSize
              );
            }
            offset = (offset + 1) % leds;
          }
        } else {
          if (offset >= 0) {
            reversing = false;
            for (i = item.start; i < item.stop; i++) {
              item.stripArray[i] = common.cylon(
                (offset + i) % leds,
                eyeColor,
                leds,
                eyeSize
              );
            }
            offset = (offset + 1) % leds;
          } else {
            for (i = item.stop - 1; i > item.start; i--) {
              item.stripArray[i] = common.cylon(
                (offset + i) % leds,
                eyeColor,
                leds,
                eyeSize
              );
            }
            offset = (offset - 1) % leds;
          }
        }

        ws281x.render();
      }
    }, item.delay);

    this.FadeInOutPause = () => {
      strips.forEach((item) => {
        ws281x.reset(); //reset strips
        item.stripTimer.pause();
      });
    };
  });
}
module.exports = {
  FadeInOut: FadeInOut,
};
