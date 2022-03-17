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

//Light animations
const rainbow = require("../animations/rainbow");
const twinkle = require("../animations/twinkle");

//Raspberry pi relay on pysical pin
const relay = 7;

// pulse speed settings that seem to be working with my stepper
const pulseSpeed = 70;
const pulseDelay = 30;

gpio.setup(relay, gpio.DIR_OUT);

//according to the manual
// const pulseSpeed = 43;
// const pulseDelay = 33;

//working!
// const pulseSpeed = 70;
// const pulseDelay = 30;

//PULSE TRAINS FOR STEPPER
io.sockets.on("connection", function(socket) {
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

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
      //pulse train 1
      (async () => {
        console.log("=======-- Train 1 START --=======");
        for (let i = 0; i < data.ptrains[0]; i++) {
          await sleep(pulseSpeed);
          gpio.write(relay, true, function(err) {
            console.log("on");
            if (err) throw err;
            (async () => {
              await sleep(pulseDelay);
              gpio.write(relay, false);
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
          gpio.write(relay, true, function(err) {
            console.log("on");
            if (err) throw err;
            (async () => {
              await sleep(pulseDelay);
              gpio.write(relay, false);
              console.log("off");
            })();
          });
        }
        console.log("FOR LOOP FINISHED!");
        // await sleep(1000);
        //once trains are finished then turn on lights
        callback({
          done: true,
        });
        console.log("CALLBACK FIRED!");
      })();
    } else if (data.state === "off") {
      gpio.write(relay, false);
    } else {
      // By default we turn off the motors
      gpio.write(relay, false);
    }
  });

  // LIGHT STRIPS FOR JUKE
  socket.on("lights", function(data) {
    console.log("Lights", data.state);
    process.on("SIGINT", function() {
      ws281x.reset();
      ws281x.finalize();

      process.nextTick(function() {
        process.exit(0);
      });
    });

    if (data.state === "on") {
      console.log(data.animation);
      switch (data.animation) {
        case "rainbow":
          console.log("Rainbow Animation!", data.stripConf);
          rainbow.Rainbow(data.stripConf.stripData);
          break;
        case "twinkle":
          console.log("Twinkle Animation!");
          twinkle.Twinkle(data.stripConf.stripData);
          break;
        default:
          console.log("Empty action received.");
          break;
      }
    } else {
      // switch (data.animation) {
      //   case "rainbow":
      //     console.log("Rainbow Animation!");
      //     rainbow.RainbowPause();
      //     break;
      //   case "twinkle":
      //     console.log("Twinkle Animation!");
      //     twinkle.TwinklePause();
      //     break;
      //   default:
      //     console.log("Empty action received.");
      //     break;
      // }
      rainbow.RainbowPause();
    }
  });
});
