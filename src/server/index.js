const express = require("express");
const app = express();
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const gpio = require("rpi-gpio");
const gpiop = gpio.promise;
const webroot = path.resolve(__dirname, "../../dist");

app.use(express.static(webroot));

//stacktrace logs
var log = console.log;
console.log = function() {
  log.apply(console, arguments);
  // Print the stack trace
  console.trace();
};

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
//selection 10
const pin = 32;
const pulseTrain1 = 2;
const pulseTrain2 = 10;

//pulse speed settings
const pulseSpeed = 200;
const pulseDelay = 100;
const pulseTrainDelay = 1500;

gpio.setup(pin, gpio.DIR_OUT);

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

//pulse train 1
io.sockets.on("connection", function(socket) {
  let direction = "cancel";
  socket.on("direction", function(data) {
    direction = data;
    console.log(data);
    let i = 0;
    if (direction === "on") {
      (async function() {
        console.log("=======-- Train 1 START --=======");
        for (i; i < pulseTrain1; i++) {
          await sleep(pulseSpeed);
          gpio.write(pin, false, function(err) {
            // console.log("on");
            if (err) throw err;
            (async function() {
              await sleep(pulseDelay);
              gpio.write(pin, true);
              //   console.log("off");
            })();
          });
        }
      })();

      // pulse train 2
      (async function() {
        await sleep(pulseTrainDelay);
        console.log("=======-- Train 2 START --=======");
        for (i; i < pulseTrain2; i++) {
          await sleep(pulseSpeed);
          gpio.write(pin, false, function(err) {
            // console.log("on");
            if (err) throw err;
            (async function() {
              await sleep(pulseDelay);
              gpio.write(pin, true);
              //   console.log("off");
            })();
          });
        }
      })();
    } else if (direction === "off") {
      gpio.write(pin, true);
    } else {
      // By default we turn off the motors
      gpio.write(pin, true);
    }
  });
});
