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
    let reversing = false;

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
      if (item.name === "main_cablight_2") {
        let stripOffset = item.start;
        //item.brightness = 10;
        if (!reversing) {
          if (stripOffset === item.start - eyeSize) {
            reversing = true;
            reverseAnimation(
              item.stop,
              item.start,
              item.stripArray,
              item.stop - item.start,
              0xff0000,
              stripOffset
            );
          } else {
            forwardAnimation(
              item.start,
              item.stop,
              item.stripArray,
              item.stop - item.start,
              0xff0000,
              stripOffset
            );
          }
        } else {
          if (stripOffset === 0) {
            reversing = false;
            forwardAnimation(
              item.start,
              item.stop,
              item.stripArray,
              item.stop - item.start,
              0xff0000,
              stripOffset
            );
          } else {
            reverseAnimation(
              item.stop,
              item.start,
              item.stripArray,
              item.stop - item.start,
              0xff0000,
              stripOffset
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
