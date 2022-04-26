const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");
const { fadeinout } = require("./common");

function FadeInOut(config) {
  let strips = config;
  // console.log(config);
  strips.forEach((item) => {
    let eyeSize = 12;
    let reverseAnimation = (
      stop,
      start,
      stripArray,
      leds,
      eyeColor,
      offset
    ) => {
      for (i = stop - 1; i > start; i--) {
        stripArray[i] = common.cylon(
          (offset + i) % leds,
          eyeColor,
          leds,
          eyeSize
        );
      }
      offset = (offset - 1) % leds;
    };

    let forwardAnimation = (
      start,
      stop,
      stripArray,
      leds,
      eyeColor,
      offset
    ) => {
      for (i = start; i < stop; i++) {
        stripArray[i] = common.cylon(
          (offset + i) % leds,
          eyeColor,
          leds,
          eyeSize
        );
      }
      offset = (offset + 1) % leds;
    };

    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      if (item.name === "title_striplight_2") {
        let offset = item.start;

        let reversing = false;
        //item.brightness = 10;
        if (!reversing) {
          if (offset === item.start - eyeSize) {
            reversing = true;
            reverseAnimation(
              item.stop,
              item.start,
              item.stripArray,
              item.stop - item.start,
              0xff0000,
              offset
            );
          } else {
            forwardAnimation(
              item.start,
              item.stop,
              item.stripArray,
              item.stop - item.start,
              0xff0000,
              offset
            );
          }
        } else {
          if (offset === 0) {
            reversing = false;
            forwardAnimation(
              item.start,
              item.stop,
              item.stripArray,
              item.stop - item.start,
              0xff0000,
              offset
            );
          } else {
            reverseAnimation(
              item.stop,
              item.start,
              item.stripArray,
              item.stop - item.start,
              0xff0000,
              offset
            );
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
