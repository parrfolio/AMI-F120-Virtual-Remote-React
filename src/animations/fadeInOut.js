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
    let reversing = false;

    let reverseAnimation = (
      stop,
      start,
      stripArray,
      eyeColor,
      leds,
      eyeSize
    ) => {
      for (i = stop - 1; i > start; i--) {
        item.stripArray[i] = common.cylon(
          (offset + i) % leds,
          eyeColor,
          leds,
          eyeSize
        );
      }
      offset = (offset - 1) % leds;
    };

    let forwardAnimation = (
      stop,
      start,
      stripArray,
      eyeColor,
      leds,
      eyeSize
    ) => {
      for (i = start; i < stop; i++) {
        item.stripArray[i] = common.cylon(
          (offset + i) % leds,
          eyeColor,
          leds,
          eyeSize
        );
      }
      offset = (offset + 1) % leds;
    };

    const randomIntFromInterval = (min, max) =>
      Math.floor(Math.random() * (max - min + 1) + min);

    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      if (item.name === "title_striplight_2") {
        //item.brightness = 10;
        if (!reversing) {
          if (offset === item.start - eyeSize) {
            reversing = true;
            reverseAnimation(
              item.stop,
              item.start,
              item.stripArray,
              item.start,
              0xcc0000,
              item.stop - item.start,
              10
            );
          } else {
            forwardAnimation(
              item.stop,
              item.start,
              item.stripArray,
              item.start,
              0xcc0000,
              item.stop - item.start
            );
          }
        } else {
          if (offset === 0) {
            reversing = false;
            forwardAnimation(
              item.stop,
              item.start,
              item.stripArray,
              item.start,
              0xcc0000,
              item.stop - item.start
            );
          } else {
            reverseAnimation(
              item.stop,
              item.start,
              item.stripArray,
              item.start,
              0xcc0000,
              item.stop - item.start
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
