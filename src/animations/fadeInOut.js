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
    let LastStates = [];
    let leds = common.num_leds();
    let eyeSize = 10;
    let eyeColor = 0xcc0000;
    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      //   for (let i = item.start; i < item.stop; i++) {
      //     item.stripArray[i] = common.fadeinout((offset + i) % 256, 0xf9f9f9);
      //   }
      //   offset = (offset + 1) % 256;

      for (let i = 0; i < leds - eyeSize - 2; i++) {
        item.stripArray[i] = 0x000000;
        for (let j = 1; j <= eyeSize; j++) {
          LastStates[i + j] = eyeColor;
          item.stripArray[i] = LastStates[i + j];
        }

        item.stripArray[i] = LastStates[i + eyeSize + 1];
      }
      //add delay here

      //   for (let i = leds - eyeSize - 2; i > 0; i--) {
      //     item.stripArray[i] = 0x000000;
      //     for (let j = 1; j <= eyeSize; j++) {
      //       LastStates[i + j] = eyeColor;
      //       item.stripArray[i] = LastStates[i + j];
      //     }
      //     item.stripArray[i] = LastStates[i + eyeSize + 1];
      //   }

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
