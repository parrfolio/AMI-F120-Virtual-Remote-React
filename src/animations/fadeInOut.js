const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");
const { fadeinout } = require("./common");

function FadeInOut(config) {
  let strips = config;
  // console.log(config);
  strips.forEach((item) => {
    let offset = 0;
    let theEye = [
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
    ];
    let leds = common.num_leds();
    let eyeSize = 20;
    let LastStates = [];
    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      let stripLeds = item.start + item.stop;
      for (i = item.start; i < item.stop; i++) {
        if (item.name === "title_striplight_1") {
          item.stripArray[i] = common.cylon((offset + i) % 256, 0xcc0000);
        }
      }

      offset = (offset + 1) % 256;

      ws281x.render();
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
