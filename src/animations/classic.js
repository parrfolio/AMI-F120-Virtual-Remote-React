const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");

function Classic(config) {
  let strips = config;
  // console.log(config);
  strips.forEach((item) => {
    let offset = 0;
    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      for (let i = item.start; i < item.stop; i++) {
        switch (item.name) {
          case "title_striplight_1":
            item.stripArray[i] = 0xffcc22;
            break;
          case "title_striplight_1a":
            item.stripArray[i] = 0xfa0b7e;
            break;
          case "title_striplight_1b":
            item.stripArray[i] = 0x10fa0b;
            break;
          case "title_striplight_2":
            item.stripArray[i] = 0x990000;
            break;
          case "main_cablight_1":
            item.stripArray[i] = 0x30cac1;
            break;
          case "main_cablight_2":
            item.stripArray[i] = 0x708fff;
            break;
          case "back_mech_light":
            item.stripArray[i] = 0xfcf9e3;
            break;
          case "front_mech_light":
            item.stripArray[i] = 0x111f99;
            break;
          case "main_cablight_1":
            item.stripArray[i] = 0x5ce091;
            break;
        }
      }
      ws281x.render();
    }, item.delay);

    this.ClassicPause = () => {
      strips.forEach((item) => {
        ws281x.reset(); //reset strips
        item.stripTimer.pause();
      });
    };
  });
}
module.exports = {
  Classic: Classic,
};
