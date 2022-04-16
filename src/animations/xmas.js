const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");

function Xmas(config) {
  let strips = config;
  // console.log(config);
  strips.forEach((item) => {
    let offset = 0;
    let DanceWidth = 15;
    let DanceArray = [];
    let XmasIterateSpeed = 75;
    let XmasIterateOffset = 0;
    let leds = common.num_leds();
    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        // item.stripArray[i] = common.RandomXmasColor();
        for (var d = 0; d < DanceWidth; d++) {
          DanceArray[d] = common.RandomXmasColor();
        }

        let DanceArrayIndex = 0;
        let x = 0 + XmasIterateOffset;
        for (x; x < leds; x++) {
          if (DanceArrayIndex < DanceWidth) {
            Strip.brightness(i);
            item.stripArray[i] = DanceArray[DanceArrayIndex];
          }
          DanceArrayIndex++;
        }
        DanceArrayIndex = 0;
        let y = leds - XmasIterateOffset;
        for (y; y > 0; y--) {
          if (DanceArrayIndex < DanceWidth) {
            Strip.brightness(i);
            item.stripArray[i] = DanceArray[DanceArrayIndex];
          }
          DanceArrayIndex++;
        }

        XmasIterateOffset++;
        if (XmasIterateOffset > leds) {
          XmasIterateOffset = 0;
          for (let d = 0; d < DanceWidth; d++) {
            DanceArray[d] = common.RandomXmasColor();
          }
        }
      }

      ws281x.render();
    }, item.delay);

    this.XmasPause = () => {
      strips.forEach((item) => {
        ws281x.reset(); //reset strips
        item.stripTimer.pause();
      });
    };
  });
}
module.exports = {
  Xmas: Xmas,
};
