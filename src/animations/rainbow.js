const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const timers = require("./timer");
const { Strip } = require("./strip");

let RecurringTimer = timers.RecurringTimer;

function Rainbow(config) {
  let configStore = config;
  configStore.forEach((item) => {
    let offset = 0;
    item.name = new Strip(item).findStrip();

    item.channelSetName = csetname;

    csetname = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        item.name[i] = common.colorwheel((offset + i) % 256);
      }
      offset = (offset + 1) % 256;
      ws281x.render();
    }, item.delay);

    this.RainbowPause = function(csetname) {
      ws281x.reset();
      csetname.pause();
    };
  });
}
module.exports = {
  Rainbow: Rainbow,
};
