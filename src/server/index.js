const express = require("express");
const app = express();
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const gpio = require("rpi-gpio");
const webroot = path.resolve(__dirname, "../../dist");
const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const { clearInterval } = require("timers");

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
const pin = 32;

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
  socket.on("direction", function(data) {
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
    } else if (data.state === "off") {
      gpio.write(pin, false);
    } else {
      // By default we turn off the motors
      gpio.write(pin, false);
    }
  });

  //LIGHTS!
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

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

  let rainbowInterval = null;
  let rainbowInterval2 = null;
  let rainbowInterval3 = null;
  let rainbowInterval4 = null;

  socket.on("lights", function(data) {
    console.log("Lights", data.state);

    let channels = ws281x.init({
      dma: 10,
      freq: 800000,
      channels: [
        {
          count: 68,
          gpio: 18,
          invert: false,
          brightness: 255,
          stripType: "ws2812",
        },
        {
          count: 60,
          gpio: 13,
          invert: false,
          brightness: 255,
          stripType: "ws2812",
        },
      ],
    });

    let offset = 0;
    let channel = channels[0];
    let colorsArray = channel.array;
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
      rainbowInterval = new RecurringTimer(function() {
        for (let i = 0; i < 8; i++) {
          colorsArray[i] = colorwheel((offset + i) % 256);
        }
        offset = (offset + 1) % 256;
        ws281x.render();
      }, 1000 / 30);

      for (let i = 8; i < 16; i++) {
        colorsArray[i] = 0xffcc22;
      }
      ws281x.render();

      rainbowInterval2 = new RecurringTimer(function() {
        for (let i = 16; i < 24; i++) {
          colorsArray[i] = colorwheel((offset + i) % 256);
        }
        offset = (offset + 1) % 256;
        ws281x.render();
      }, 1000 / 30);

      for (let i = 24; i < 30; i++) {
        colorsArray[i] = 0xffcc22;
      }
      ws281x.render();

      rainbowInterval3 = new RecurringTimer(function() {
        for (let i = 30; i < 60; i++) {
          colorsArray[i] = colorwheel((offset + i) % 256);
        }
        offset = (offset + 1) % 256;
        ws281x.render();
      }, 1000 / 30);

      //neopixel stick
      rainbowInterval4 = new RecurringTimer(function() {
        for (let i = 60; i < 68; i++) {
          colorsArray[i] = colorwheel((offset + i) % 256);
        }
        offset = (offset + 1) % 256;
        ws281x.render();
      }, 1000 / 30);
    } else {
      rainbowInterval.pause();
      rainbowInterval2.pause();
      rainbowInterval3.pause();
      rainbowInterval4.pause();
      ws281x.reset();
      ws281x.finalize();
    }
  });
});
