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

//lights!
// const lightpin = 18;
// gpio.setup(lightpin, gpio.DIR_OUT);

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

// const channels = ws281x.init({
//   dma: 10,
//   freq: 800000,
//   channels: [
//     {
//       count: 100,
//       gpio: 18,
//       invert: false,
//       brightness: 255,
//       stripType: "ws2812",
//     },
//   ],
// });

const channels = ws281x.init({
  dma: 10,
  freq: 800000,
  channels: [
    {
      count: 100,
      gpio: 18,
      invert: false,
      brightness: 255,
      stripType: "ws2812",
    },
    {
      count: 100,
      gpio: 13,
      invert: false,
      brightness: 255,
      stripType: "ws2812",
    },
  ],
});
console.log(channels);
let offset = 0;
const channel = channels[0];
const colorsArray = channel.array;

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

  socket.on("lights", function(data) {
    console.log("Lights", data.state);

    //only when the app terminates the ligts turn off with node Signal Int
    process.on("SIGINT", function() {
      ws281x.reset();
      ws281x.finalize();

      process.nextTick(function() {
        process.exit(0);
      });
    });
    let rainbowInterval = null;
    if (data.state === "on") {
      rainbowInterval = setInterval(() => {
        for (let i = 0; i < channel.count; i++) {
          colorsArray[i] = colorwheel((offset + i) % 256);
        }
        offset = (offset + 1) % 256;
        //console.log(colorsArray);
        // if (colorsArray === 0) {
        //   clearInterval(rainbowInterval);
        //   console.log("interval cleared!");
        //   ws281x.finalize(colorsArray);
        // } else {

        // }

        console.log("Ligths", data.state);

        if (data.state === "off") {
          console.log(
            "============================OFF========================"
          );
        }

        ws281x.render(colorsArray);
      }, 1000 / 30);
    } else {
      //  console.log("Lights", data.state);
      // clearInterval(rainbowInterval);
      // console.log("BEFORE RESET", colorsArray);
      ws281x.reset(colorsArray);
      // ws281x.finalize(colorsArray);

      // console.log("AFTER RESET", colorsArray);
    }
  });
});
