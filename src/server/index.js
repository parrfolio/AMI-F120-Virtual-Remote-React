const express = require("express");
const app = express();
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const gpio = require("rpi-gpio");
const gpiop = gpio.promise;
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

// pulse speed settings
const pulseSpeed = 70;
const pulseDelay = 30;

//according to the manual
// const pulseSpeed = 43;
// const pulseDelay = 33;
// const pulseTrainDelay = 130;

//working!
// const pulseSpeed = 70;
// const pulseDelay = 30;
// const pulseTrainDelay = 600;

gpio.setup(pin, gpio.DIR_OUT);

//lights!
// const lightpin = 18;
// gpio.setup(lightpin, gpio.DIR_OUT);

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

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
    console.log("Lights State", data.state);
    if (data.state === "on") {
      var NUM_LEDS = parseInt(process.argv[2], 10) || 10,
        pixelData = new Uint32Array(NUM_LEDS);

      console.log(NUM_LEDS, pixelData);
      ws281x.init(NUM_LEDS);

      // ---- trap the SIGINT and reset before exit
      process.on("SIGINT", function() {
        ws281x.reset();
        process.nextTick(function() {
          process.exit(0);
        });
      });

      // ---- animation-loop
      var offset = 0;
      setInterval(function() {
        for (var i = 0; i < NUM_LEDS; i++) {
          //console.log(pixelData[i]);
          pixelData[i] = colorwheel((offset + i) % 256);
        }

        offset = (offset + 1) % 256;
        ws281x.render(pixelData);
      }, 1000 / 30);

      console.log("Press <ctrl>+C to exit.");

      // rainbow-colors, taken from http://goo.gl/Cs3H0v
      function colorwheel(pos) {
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
      }

      function rgb2Int(r, g, b) {
        return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
      }
    }
  });
});
