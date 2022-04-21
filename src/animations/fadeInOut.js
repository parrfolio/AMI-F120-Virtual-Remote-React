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

    const range = (n) =>
      (Array.range = (start, end) =>
        Array.from({ length: end - start }, (v, k) => k + start));

    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      for (i = item.start; i < item.stop; i++) {
        for (let x = 0; x < leds - eyeSize - 2; x++) {
          item.stripArray[x] = 0xcc0000 / 10;
          //   setPixel(x, red / 10, green / 10, blue / 10);
          (async () => {
            for (let j = 1; j <= eyeSize; j++) {
              await sleep(500);
              let array = item.stripArray;
              let range = array.range(x + 10, j);
              range = 0xcc0000;
            }
            item.stripArray[x + eyeSize + 1] = 0xcc0000 / 10;
            //   setPixel(x + EyeSize + 1, red / 10, green / 10, blue / 10);
            //   showStrip();
            //   delay(SpeedDelay);
          })();
        }
      }

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
