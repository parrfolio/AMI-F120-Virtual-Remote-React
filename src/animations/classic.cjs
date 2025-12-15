const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common.cjs");
const { RecurringTimer } = require("./timer.cjs");
const { Strip } = require("./strip.cjs");

let activeStrips = [];

function Classic(config) {
  activeStrips = config;
  // console.log(config);
  activeStrips.forEach((item) => {
    let offset = 0;
    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function () {
      let color = 0x000000; // default black
      switch (item.name) {
        case "record_rack":
          color = 0xffffff;
          break;
        case "cabinet_accent":
          color = 0xffffff;
          break;
        case "titlestrips_bottom":
          color = 0xffffff;
          break;
        case "titlestrips_top":
          color = 0xffffff;
          break;
        case "extra_leds":
          color = 0x000000;
          break;
        case "cabinet_ami_logo":
          color = 0xffffff;
          break;
        case "door_light":
          color = 0xffffff;
          break;
      }
      for (let i = item.start; i < item.stop; i++) {
        item.stripArray[i] = color;
      }
      ws281x.render();
    }, item.delay);
  });
}

function ClassicPause() {
  ws281x.reset();
  activeStrips.forEach((item) => {
    if (item.stripTimer) {
      item.stripTimer.pause();
    }
  });
}

module.exports = {
  Classic: Classic,
  ClassicPause: ClassicPause,
};
