const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");

function FadeInOut(config) {
  let strips = config;
  // console.log(config);
  strips.forEach((item) => {
    let offset = 0;
    let r, g, b;
    let red = 0xff;
    let green = 0x77;
    let blue = 0x00;
    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        // item.stripArray[i] = common.fadeinout(0xff, 0x77, 0x00);

        for (let k = 0; k < 256; k = k + 1) {
          r = (k / 256.0) * red;
          g = (k / 256.0) * green;
          b = (k / 256.0) * blue;

          item.stripArray[i] = r + g + b;
          ws281x.render();
        }

        for (let k = 255; k >= 0; k = k - 2) {
          r = (k / 256.0) * red;
          g = (k / 256.0) * green;
          b = (k / 256.0) * blue;
          item.stripArray[i] = r + g + b;
          ws281x.render();
        }
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
