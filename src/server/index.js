const express = require("express");
const app = express();
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const gpio = require("rpi-gpio");
const webroot = path.resolve(__dirname, "../../dist");
const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");

app.use(express.static(webroot));

//for routing
app.get("*", function(req, res) {
  res.sendFile("index.html", {
    root: webroot,
  });
});

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(webroot);
  console.log(`Server listening on ${PORT}`);
});

//pulse train selections=
// const pin = 32;
const pin = 7;
// pulse speed settings that seem to be working with my stepper
const pulseSpeed = 70;
const pulseDelay = 30;

//according to the manual
// const pulseSpeed = 43;
// const pulseDelay = 33;

//working!
// const pulseSpeed = 70;
// const pulseDelay = 30;

gpio.setup(pin, gpio.DIR_OUT);

//PULSE TRAINS FOR STEPPER
//pulse train 1
io.sockets.on("connection", function(socket) {
  socket.on("direction", (data, callback) => {
    console.log("DATA: ", data);
    console.log("Selection", data.selection);
    console.log("===-- SELECTION --===", data.selection);
    console.log(
      "===-- Pulse Train Rel --===",
      data.ptrains[0],
      data.ptrains[1]
    );

    if (data.state === "on") {
      (async () => {
        console.log("=======-- Train 1 START --=======");
        for (let i = 0; i < data.ptrains[0]; i++) {
          await sleep(pulseSpeed);
          gpio.write(pin, true, function(err) {
            console.log("on");
            if (err) throw err;
            (async () => {
              await sleep(pulseDelay);
              gpio.write(pin, false);
              console.log("off");
            })();
          });
        }
      })();

      // pulse train 2
      (async () => {
        await sleep(data.ptrainDelay);
        console.log("=======-- Train 2 START --=======");
        for (let i = 0; i < data.ptrains[1]; i++) {
          await sleep(pulseSpeed);
          gpio.write(pin, true, function(err) {
            console.log("on");
            if (err) throw err;
            (async () => {
              await sleep(pulseDelay);
              gpio.write(pin, false);
              console.log("off");
            })();
          });
        }
      })();

      callback({
        status: false,
      });
    } else if (data.state === "off") {
      gpio.write(pin, false);
    } else {
      // By default we turn off the motors
      gpio.write(pin, false);
    }
  });

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  //light functions
  const colorwheel = (pos) => {
    pos = 255 - pos;
    if (pos < 85) {
      return rgb2Int(255 - pos * 3, 0, pos * 3);
    } else if (pos < 170) {
      pos -= 85;
      return rgb2Int(0, pos * 3, 255 - pos * 3);
    } else {
      pos -= 170;
      return rgb2Int(pos * 3, 255 - pos * 3, 0);
    }
  };

  const rgb2Int = (r, g, b) => {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
  };

  //twinkle
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

  let WasTwinkling = false;
  let TwinkleSpeed = 250;
  let LastStates = [];

  let getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  let GetNextColor = function(col, rand) {
    var ind = TwinkleColors.indexOf(col);
    if (ind == TwinkleColors.length + 1) {
      // choose the first
      return TwinkleColors[0];
    } else {
      // choose the next
      return TwinkleColors[ind + 1];
    }
  };

  //channel 1 strips
  let rainbowInterval = null;
  let rainbowInterval2 = null;
  let rainbowInterval3 = null;
  let rainbowInterval4 = null;

  //channel 2 strips here
  let rainbowInterval5 = null;
  let rainbowInterval6 = null;

  socket.on("lights", function(data) {
    console.log("Lights", data.state);

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

    let timer = true;
    //only when the app terminates the ligts turn off with node Signal Int
    process.on("SIGINT", function() {
      ws281x.reset();
      ws281x.finalize();

      process.nextTick(function() {
        process.exit(0);
      });
    });

    function RecurringTimer(callback, delay) {
      var timerId,
        start,
        remaining = delay;

      var pause = function() {
        console.log("pause was called");
        clearTimeout(timerId);
        remaining -= new Date() - start;
      };

      let resume = function() {
        start = new Date();
        timerId = setTimeout(function() {
          remaining = delay;
          resume();
          callback();
        }, remaining);
      };

      this.resume = resume;
      this.pause = pause;

      this.resume();
    }

    if (data.state === "on") {
      //channel 1 stips
      rainbowInterval = new RecurringTimer(function() {
        for (let i = 0; i < 150; i++) {
          colorsArray1[i] = colorwheel((offset + i) % 256);
        }
        offset = (offset + 1) % 256;
        ws281x.render();
      }, 1000 / 30);

      rainbowInterval2 = new RecurringTimer(function() {
        for (let i = 120; i < 300; i++) {
          colorsArray1[i] = colorwheel((offset + i) % 256);
        }
        offset = (offset + 1) % 256;
        ws281x.render();
      }, 1000 / 30);

      //twinkle animation
      // rainbowInterval2 = new RecurringTimer(function() {
      //   if (!WasTwinkling) {
      //     for (let i = 120; i < 300; i++) {
      //       var init = getRandomInt(0, TwinkleColors.length - 1);
      //       LastStates[i] = TwinkleColors[init]; // default white color
      //       colorsArray1[i] = LastStates[i];
      //     }

      //     ws281x.render();
      //     WasTwinkling = true;
      //   } else {
      //     for (let i = 120; i < 240; i++) {
      //       var shouldTwinkle = getRandomInt(0, 100);
      //       if (shouldTwinkle > 10) {
      //         // only a 50% chance of twinkling
      //         var currentColor = LastStates[i];
      //         var newColor = GetNextColor(currentColor);
      //         LastStates[i] = newColor;
      //         colorsArray1[i] = LastStates[i];
      //       }
      //     }
      //     ws281x.render();
      //   }
      // }, 1000 / 30);

      //channel 1 neopixel sticks
      // rainbowInterval4 = new RecurringTimer(function() {
      //   for (let i = 60; i < 68; i++) {
      //     colorsArray1[i] = colorwheel((offset + i) % 256);
      //   }
      //   offset = (offset + 1) % 256;
      //   ws281x.render();
      // }, 1000 / 30);

      //channel 2 strips
      rainbowInterval3 = new RecurringTimer(function() {
        for (let i = 0; i < 20; i++) {
          colorsArray2[i] = colorwheel((offset + i) % 256);
        }
        offset = (offset + 1) % 256;
        ws281x.render();
      }, 1000 / 30);

      for (let i = 20; i < 40; i++) {
        colorsArray2[i] = 0xffcc22;
      }
      ws281x.render();

      rainbowInterval4 = new RecurringTimer(function() {
        for (let i = 40; i < 60; i++) {
          colorsArray2[i] = colorwheel((offset + i) % 256);
        }
        offset = (offset + 1) % 256;
        ws281x.render();
      }, 1000 / 30);
    } else {
      ws281x.reset();
      //channel 1 strips
      rainbowInterval.pause();
      rainbowInterval2.pause();
      //channel 2 strips
      rainbowInterval3.pause();
      rainbowInterval4.pause();
      ws281x.finalize();
    }
  });
});
