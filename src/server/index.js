const express = require("express");
const app = express();
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const gpio = require("rpi-gpio");
const gpiop = gpio.promise;
const webroot = path.resolve(__dirname, "../../dist");
var ws281x = require("rpi-ws281x");

class Example {
  constructor() {
    this.config = {};

    // Number of leds in my strip
    this.config.leds = 300;

    // Use DMA 10 (default 10)
    this.config.dma = 10;

    // Set full brightness, a value from 0 to 255 (default 255)
    this.config.brightness = 255;

    // Set the GPIO number to communicate with the Neopixel strip (default 18)
    this.config.gpio = 18;

    // The RGB sequence may vary on some strips. Valid values
    // are "rgb", "rbg", "grb", "gbr", "bgr", "brg".
    // Default is "rgb".
    // RGBW strips are not currently supported.
    this.config.stripType = "grb";

    // Configure ws281x
    ws281x.configure(this.config);
  }

  run() {
    // Create a pixel array matching the number of leds.
    // This must be an instance of Uint32Array.
    var pixels = new Uint32Array(this.config.leds);

    // Create a fill color with red/green/blue.
    var red = 255,
      green = 0,
      blue = 0;
    var color = (red << 16) | (green << 8) | blue;

    for (var i = 0; i < this.config.leds; i++) pixels[i] = color;

    // Render to strip
    ws281x.render(pixels);
  }
}

var example = new Example();

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
      (async function() {
        console.log("=======-- Train 1 START --=======");
        for (let i = 0; i < data.ptrains[0]; i++) {
          await sleep(pulseSpeed);
          gpio.write(pin, true, function(err) {
            console.log("on");
            if (err) throw err;
            (async function() {
              await sleep(pulseDelay);
              gpio.write(pin, false);
              console.log("off");
            })();
          });
        }
      })();

      // pulse train 2
      (async function() {
        await sleep(data.ptrainDelay);
        console.log("=======-- Train 2 START --=======");
        for (let i = 0; i < data.ptrains[1]; i++) {
          await sleep(pulseSpeed);
          gpio.write(pin, true, function(err) {
            console.log("on");
            if (err) throw err;
            (async function() {
              await sleep(pulseDelay);
              gpio.write(pin, false);
              console.log("off");
            })();
          });
        }
      })();
      data;
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
      example.run();
    }
  });
});
