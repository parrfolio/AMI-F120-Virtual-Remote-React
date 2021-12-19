const express = require("express");
const app = express();
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const gpio = require("rpi-gpio");
const gpiop = gpio.promise;
const webroot = path.resolve(__dirname, "../../dist");

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
//selection 10
const pin = 32;

//pulse speed settings
const pulseSpeed = 100;
const pulseDelay = 50;
const pulseTrainDelay = 800;

gpio.setup(pin, gpio.DIR_OUT);

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
          gpio.write(pin, false, function(err) {
            console.log("on");
            if (err) throw err;
            (async function() {
              await sleep(pulseDelay);
              gpio.write(pin, true);
              console.log("off");
            })();
          });
        }
      })();

      // pulse train 2
      (async function() {
        await sleep(pulseTrainDelay);
        console.log("=======-- Train 2 START --=======");
        for (let i = 0; i < data.ptrains[1]; i++) {
          await sleep(pulseSpeed);
          gpio.write(pin, false, function(err) {
            console.log("on");
            if (err) throw err;
            (async function() {
              await sleep(pulseDelay);
              gpio.write(pin, true);
              console.log("off");
            })();
          });
        }
      })();
    } else if (data.state === "off") {
      gpio.write(pin, true);
    } else {
      // By default we turn off the motors
      gpio.write(pin, true);
    }
  });
});
