const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const { RecurringTimer } = require("./timer.cjs");
const { Strip } = require("./strip.cjs");

let activeStrips = [];

function Original(config) {
  activeStrips = config;

  activeStrips.forEach((item) => {
    item.stripArray = new Strip(item).findStrip();
    item.stripTimer = new RecurringTimer(function () {
      let color = 0x000000;

      switch (item.name) {
        case "record_rack":
          color = 0xffffe0; // light yellow
          break;
        case "cabinet_accent":
          color = 0xffffe0; // light yellow
          break;
        case "titlestrips_bottom":
          color = 0xffffff; // bright white
          break;
        case "titlestrips_top":
          color = 0xffffff; // bright white
          break;
        case "extra_leds":
          color = 0x000000; // off
          break;
        case "cabinet_ami_logo":
          color = 0xffffff; // bright white
          break;
        case "door_light":
          color = 0xff0000; // red
          break;
      }

      for (let i = item.start; i < item.stop; i++) {
        item.stripArray[i] = color;
      }
      ws281x.render();
    }, item.delay);
  });
}

function OriginalPause() {
  ws281x.reset();
  activeStrips.forEach((item) => {
    if (item.stripTimer) {
      item.stripTimer.pause();
    }
  });
}

module.exports = {
  Original,
  OriginalPause,
};
