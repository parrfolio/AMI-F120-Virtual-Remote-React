const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const timers = require("./timer");
const { Strip } = require("./strip");

let RecurringTimer = timers.RecurringTimer;

function Rainbow(config) {
  let foo;
  config.forEach((item) => {
    let offset = 0;
    foo = item.channelSetName;
    item.name = new Strip(item).findStrip();
    foo = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        item.name[i] = common.colorwheel((offset + i) % 256);
      }
      offset = (offset + 1) % 256;
      ws281x.render();
    }, item.delay);
  });

  this.RainbowPause = function(pause) {
    console.log(pause);
    pause.forEach((item) => {
      ws281x.reset();
      console.log(item);
      foo.pause();
    });
  };
}
module.exports = {
  Rainbow: Rainbow,
};
