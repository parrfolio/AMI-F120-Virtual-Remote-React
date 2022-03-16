const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");

function Rainbow(config) {
  console.log(config);
  let strips = config;
  strips.forEach((item) => {
    let offset = 0;
    item.name = new Strip(item).findStrip();

    item.channelSetName = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        item.name[i] = common.colorwheel((offset + i) % 256);
      }
      offset = (offset + 1) % 256;
      new Strip.stripRender();
    }, item.delay);

    this.RainbowPause = () => {
      strips.forEach((item) => {
        ws281x.reset(); //reset strips
        item.channelSetName.pause();
      });
    };
  });
}
module.exports = {
  Rainbow: Rainbow,
};
