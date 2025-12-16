const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const { Strip } = require("./strip.cjs");

let activeStrips = [];

function Classic(config) {
  activeStrips = config;

  // Classic is static: set colors once and render once.
  activeStrips.forEach((item) => {
    item.stripArray = new Strip(item).findStrip();

    // All strips white, except extra_leds off
    const color = item.name === "extra_leds" ? 0x000000 : 0xffffff;

    for (let i = item.start; i < item.stop; i++) {
      item.stripArray[i] = color;
    }
  });

  ws281x.render();
}

function ClassicPause() {
  ws281x.reset();
}

module.exports = {
  Classic,
  ClassicPause,
};
