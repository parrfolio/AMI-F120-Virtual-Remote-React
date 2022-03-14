const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const timers = require("./timer");
let ledCount = 300;
let channels = ws281x.init({
  dma: 10,
  freq: 800000,
  channels: [
    {
      count: ledCount,
      gpio: 18,
      invert: false,
      brightness: 255,
      stripType: "ws2812",
    },
    {
      count: ledCount,
      gpio: 13,
      invert: false,
      brightness: 255,
      stripType: "ws2812",
    },
  ],
});

// gpio: 19 works as well

let offset = 0;
//channel 1 strips on GPIO 18
let channel1 = channels[0];
let colorsArray1 = channel1.array;

//channel 2 strips on GPIO 13
let channel2 = channels[1];
let colorsArray2 = channel2.array;

let RecurringTimer = timers.RecurringTimer;

let interval = null;

function Rainbow(config) {
  console.log();
  interval = new RecurringTimer(function() {
    for (let i = config[1].start; i < config[1].stop; i++) {
      colorsArray1[i] = common.colorwheel((offset + i) % 256);
    }
    offset = (offset + 1) % 256;
    ws281x.render();
  }, config[0].delay);
}

function RainbowPause() {
  interval.pause();
  //ws281x.finalize();
}

module.exports = {
  Rainbow: Rainbow,
  RainbowPause: RainbowPause,
};
