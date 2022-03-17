const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");

function Rainbow(config) {
  let strips = config;
  console.log(strips);
  strips.forEach((item) => {
    let offset = 0;
    item["stripArray"] = new Strip(item).findStrip();

    item["stripTimer"] = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        item.stripArray[i] = common.colorwheel((offset + i) % 256);
      }
      offset = (offset + 1) % 256;
      ws281x.render();
    }, item.delay);

    this.RainbowPause = () => {
      strips.forEach((item) => {
        ws281x.reset(); //reset strips
        item.stripTimer.pause();
      });
    };
  });
}
module.exports = {
  Rainbow: Rainbow,
};
