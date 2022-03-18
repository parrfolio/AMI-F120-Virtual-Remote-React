const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");

function Twinkle(config) {
  let TwinkleColors = [
    0xffffff,
    0xfcfcfc,
    0xfafafa,
    0xf7f7f7,
    0xf5f5f5,
    0xf2f2f2,
    0xf0f0f0,
    0xededed,
    0xebebeb,
    0xe8e8e8,
    0xe5e5e5,
    0xe3e3e3,
    0xe0e0e0,
    0xdedede,
    0xdbdbdb,
    0xd9d9d9,
    0xd6d6d6,
    0xd4d4d4,
    0xd1d1d1,
    0xcfcfcf,
    0xcccccc,
    0xc9c9c9,
    0xc7c7c7,
    0xc4c4c4,
    0xc2c2c2,
    0xbfbfbf,
    0xbdbdbd,
    0xbababa,
    0xb8b8b8,
    0xb5b5b5,
    0xb3b3b3,
    0xb0b0b0,
  ];
  let strips = config;
  let WasTwinkling = false;
  let TwinkleSpeed = 250;
  let LastStates = [];
  strips.forEach((item) => {
    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        var init = common.getRandomInt(0, TwinkleColors.length - 1);
        LastStates[i] = TwinkleColors[init]; // default white color
        item.stripArray[i] = LastStates[i];
      }

      ws281x.render();
    }, item.delay);

    this.TwinklePause = () => {
      strips.forEach((item) => {
        ws281x.reset(); //reset strips
        item.stripTimer.pause();
      });
    };
  });
}
module.exports = {
  Twinkle: Twinkle,
};
