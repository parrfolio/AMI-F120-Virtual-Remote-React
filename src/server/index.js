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

    // let strip5Config = {
    //   name: "strip5",
    //   delay: 1000 / 30,
    //   start: 60,
    //   stop: 120,
    //   channel: 1,
    // };

    // let strip6Config = {
    //   name: "strip6",
    //   delay: 1000 / 30,
    //   start: 120,
    //   stop: 128,
    //   channel: 1,
    // };

    // let strip1Config = {
    //   name: "strip1",
    //   delay: 1000 / 30,
    //   start: 0,
    //   stop: 60,
    //   channelSet: 0,
    //   channelSetName: "set1",
    // };

    // let strip2Config = {
    //   name: "strip2",
    //   delay: 1000 / 30,
    //   start: 60,
    //   stop: 120,
    //   channelSet: 0,
    //   channelSetName: "set1",
    // };

    // let strip3Config = {
    //   name: "strip3",
    //   delay: 1000 / 30,
    //   start: 120,
    //   stop: 300,
    //   channelSet: 0,
    //   channelSetName: "set1",
    // };

    // let strip4Config = {
    //   name: "strip4",
    //   delay: 1000 / 30,
    //   start: 0,
    //   stop: 60,
    //   channelSet: 1,
    //   channelSetName: "set2",
    // };

    let stripsConfig = [
      {
        name: "strip1",
        delay: 1000 / 30,
        start: 0,
        stop: 60,
        channelSet: 0,
        channelSetName: "set1",
      },
      {
        name: "strip2",
        delay: 1000 / 30,
        start: 60,
        stop: 120,
        channelSet: 0,
        channelSetName: "set1",
      },
      {
        name: "strip3",
        delay: 1000 / 30,
        start: 120,
        stop: 300,
        channelSet: 0,
        channelSetName: "set1",
      },
      {
        name: "strip4",
        delay: 1000 / 30,
        start: 0,
        stop: 60,
        channelSet: 1,
        channelSetName: "set2",
      },
      {
        name: "strip5",
        delay: 1000 / 30,
        start: 60,
        stop: 120,
        channelSet: 1,
        channelSetName: "set2",
      },
      {
        name: "strip6",
        delay: 1000 / 30,
        start: 120,
        stop: 128,
        channelSet: 1,
        channelSetName: "set2",
      },
    ];

    if (data.state === "on") {
      switch (data.animation) {
        case "rainbow":
          rainbow.Rainbow(stripsConfig);
          break;
        case "say_hi":
          let message = "hi";
          console.log(message);
          break;
        default:
          console.log("Empty action received.");
          break;
      }
    } else {
      rainbow.RainbowPause();
    }
  });
});
