const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const { Strip } = require("./strip.cjs");

let activeStrips = [];

function Classic(config) {
  activeStrips = config;

  // Set all colors once - no need for timers since colors are static
  activeStrips.forEach((item) => {
    item.stripArray = new Strip(item).findStrip();

    let color = 0x000000;

    switch (item.name) {
      case "record_rack":
        color = 0xffffff; // light yellow
        break;
      case "cabinet_accent":
        color = 0xffffff; // light yellow
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
        color = 0xffffff; // red
        break;
    }

    for (let i = item.start; i < item.stop; i++) {
      item.stripArray[i] = color;
    }
  });

  // Render once after all strips are set
  ws281x.render();
}

function ClassicPause() {
  ws281x.reset();
  // No timers to pause since Classic is static
}

module.exports = {
  Classic,
  ClassicPause,
};
