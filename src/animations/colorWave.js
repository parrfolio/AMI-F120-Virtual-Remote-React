const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");

function ColorWave(config) {
  let strips = config;

  strips.forEach((item) => {
    let ledIndex = 0;
    let iterationIndex = 0;
    let maxIterations = 256 * 5;

    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      //item.stripArray[i]

      console.log(Strip.ledCount);
      for (let i = item.start; i < item.stop; i++) {
        if (iterationIndex < maxIterations) {
          if (ledIndex < Strip.ledCount) {
            item.stripArray[i] = common.colorwheel(
              ((ledIndex * 256) / Strip.ledCount + iterationIndex) & 255
            );

            ledIndex++;
          } else {
            ledIndex = 0;
            iterationIndex++;
          }
        } else {
          ledIndex = 0;
          iterationIndex = 0;
        }
      }
      ws281x.render();
    }, item.delay);

    this.ColorWavePause = () => {
      strips.forEach((item) => {
        ws281x.reset(); //reset strips
        item.stripTimer.pause();
      });
    };
  });
}
module.exports = {
  ColorWave: ColorWave,
};
