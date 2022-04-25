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
    // let leds = common.num_leds();

    let leds = item.stop - item.start;

    let ledsOpp = item.start - item.stop;

    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      if (item.name === "title_striplight_2") {
        if (offset != 100) {
          for (i = item.start; i < item.stop; i++) {
            item.stripArray[i] = common.cylon(
              (offset + i) % leds,
              0xcc0000,
              leds
            );
          }
          offset = (offset + 1) % leds;
        } else {
          for (i = item.stop - 1; i > item.start; i--) {
            item.stripArray[i] = common.cylon(
              (offset + i) % leds,
              0xcc0000,
              leds
            );
          }
          offset = (offset - 1) % leds;
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
