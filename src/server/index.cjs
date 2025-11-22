const express = require("express");
var fs = require("fs");

const app = express();
const path = require("path");
const http = require("http").Server(app);

const privateKey = fs.readFileSync(__dirname + "/server.key", "utf8");
const certificate = fs.readFileSync(__dirname + "/server.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };
const https = require("https").Server(credentials, app);
const io = require("socket.io")(http);
const webroot = path.resolve(__dirname, "../../dist");

//turned off for mac dev, need back in package to run on rasp
// const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");

// Platform detection
const isRaspberryPi =
  process.platform === "linux" && require("os").arch() === "arm";

// GPIO stub for development
const createGpioStub = () => ({
  DIR_OUT: "out",
  setup: (pin, direction, callback) => {
    console.log(`[DEV MODE] GPIO setup: pin ${pin}, direction ${direction}`);
    if (callback) callback();
  },
  write: (pin, value, callback) => {
    console.log(`[DEV MODE] GPIO write: pin ${pin}, value ${value}`);
    if (callback) callback();
  },
  destroy: (callback) => {
    console.log("[DEV MODE] GPIO cleanup");
    if (callback) callback();
  },
});

// Load real GPIO on Pi, use stub on dev machines
let gpio;
if (isRaspberryPi) {
  try {
    gpio = require("rpi-gpio");
    console.log("✓ GPIO module loaded (Raspberry Pi mode)");
  } catch (err) {
    console.log("⚠ GPIO failed to load:", err.message);
    gpio = createGpioStub();
  }
} else {
  console.log("⚠ Development mode: GPIO stubbed (not running on Raspberry Pi)");
  gpio = createGpioStub();
}

//not being used at this time (digital display)
//const i2c = require("i2c-bus");
// const sleepMore = require("sleep");

var os = require("os");

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
  for (var k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family === "IPv4" && !address.internal) {
      addresses.push(address.address);
    }
  }
}

app.use(express.static(webroot));

const httpPORT = process.env.PORT || 8080;
http.listen(httpPORT, () => {
  console.log(`Running at http://${addresses}:${httpPORT} from ${webroot}`);
});

const httpsPORT = process.env.PORT || 8443;

https.listen(httpsPORT, () => {
  console.log(`Running at https://${addresses}:${httpsPORT} from ${webroot}`);
});

process.on("SIGINT", function () {
  // Cleanup - ws281x is only available on Raspberry Pi
  ws281x.reset();
  ws281x.finalize();

  gpio.destroy(function () {
    console.log("GPIO cleanup complete");
  });

  process.nextTick(function () {
    process.exit(0);
  });
});

//Light animations
// Create stub objects for development (LED animations require Raspberry Pi hardware)
const createAnimationStub = (name) => ({
  [name]: (stripConf) => {
    console.log(
      `[DEV MODE] ${name} animation triggered with config:`,
      stripConf ? `${stripConf.length} strips` : "default"
    );
  },
  [`${name}Pause`]: () => {
    console.log(`[DEV MODE] ${name} animation paused`);
  },
});

// Try to load real animations on Raspberry Pi, use stubs on development machines
let rainbow, twinkle, colorWave, xmas, classic, fadeInOut;

if (isRaspberryPi) {
  try {
    rainbow = require("../animations/rainbow");
    twinkle = require("../animations/twinkle");
    colorWave = require("../animations/colorWave");
    xmas = require("../animations/xmas");
    classic = require("../animations/classic");
    fadeInOut = require("../animations/fadeInOut");
    console.log("✓ LED animation modules loaded (Raspberry Pi mode)");
  } catch (err) {
    console.log("⚠ LED animations failed to load:", err.message);
    rainbow = createAnimationStub("Rainbow");
    twinkle = createAnimationStub("Twinkle");
    colorWave = createAnimationStub("ColorWave");
    xmas = createAnimationStub("Xmas");
    classic = createAnimationStub("Classic");
    fadeInOut = createAnimationStub("FadeInOut");
  }
} else {
  console.log(
    "⚠ Development mode: LED animations stubbed (not running on Raspberry Pi)"
  );
  rainbow = createAnimationStub("Rainbow");
  twinkle = createAnimationStub("Twinkle");
  colorWave = createAnimationStub("ColorWave");
  xmas = createAnimationStub("Xmas");
  classic = createAnimationStub("Classic");
  fadeInOut = createAnimationStub("FadeInOut");
}

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
io.sockets.on("connection", function (socket) {
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  socket.on("direction", (data, callback) => {
    console.log("DATA: ", data); //select.selection

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
          gpio.write(relay, true, function (err) {
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
          gpio.write(relay, true, function (err) {
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
        // console.log("CALLBACK FIRED!");

        //i2c bus LCD readout
        // const LCD_IC2_ADDRESS = 0x27;
        // const IC2_BUS_NUMBER = 1;
        // const LCD_BACKLIGHT = 0x08;
        // const LCD_REGISTER_SELECT_CMND = 0x00;
        // const LCD_REGISTER_SELECT_CHAR = 0x01;
        // const LCD_ENABLE = 0x04;

        // const IC2_bus = i2c.open(IC2_BUS_NUMBER, (err) => {
        //   if (err) {
        //     console.log("Error opening I2C bus", err);
        //     process.exit(1);
        //   }

        //   initializeLCD();
        //   positionCursor(LCD_LINE1, 0);
        //   writeStringToLCD(data.songTitle);
        //   positionCursor(LCD_LINE2, 0);
        //   writeStringToLCD(
        //     "Track" + data.select.selection.toString() + " Side " + data.side
        //   );
        // });

        // const handleI2CError = (err, bytesWritten, buffer) => {
        //   if (err) {
        //     console.log("Error writing to I2C bus", err);
        //   }
        // };

        // const rawTimedWrite = (dataInUpperNibble, cmndOrChar) => {
        //   let cleanData = dataInUpperNibble & 0xf0;
        //   let cleanRS = cmndOrChar & 0x1;
        //   IC2_bus.i2cWrite(
        //     LCD_IC2_ADDRESS,
        //     1,
        //     Buffer.from([cleanData | LCD_BACKLIGHT | cleanRS]),
        //     handleI2CError
        //   );
        //   sleepMore.msleep(10);
        //   IC2_bus.i2cWrite(
        //     LCD_IC2_ADDRESS,
        //     1,
        //     Buffer.from([cleanData | LCD_BACKLIGHT | LCD_ENABLE | cleanRS]),
        //     handleI2CError
        //   );
        //   sleepMore.msleep(10);
        //   IC2_bus.i2cWrite(
        //     LCD_IC2_ADDRESS,
        //     1,
        //     Buffer.from([cleanData | LCD_BACKLIGHT | cleanRS]),
        //     handleI2CError
        //   );
        //   sleepMore.msleep(2);
        // };

        // const initializeLCD = () => {
        //   sleepMore.msleep(200);
        //   rawTimedWrite(0x30, LCD_REGISTER_SELECT_CMND);
        //   sleepMore.usleep(100);
        //   rawTimedWrite(0x30, LCD_REGISTER_SELECT_CMND);
        //   sleepMore.usleep(100);
        //   rawTimedWrite(0x30, LCD_REGISTER_SELECT_CMND);
        //   sleepMore.usleep(10);
        //   rawTimedWrite(0x30, LCD_REGISTER_SELECT_CMND);
        //   rawTimedWrite(0x20, LCD_REGISTER_SELECT_CMND);
        //   rawTimedWrite(0x20, LCD_REGISTER_SELECT_CMND);
        //   rawTimedWrite(0x80, LCD_REGISTER_SELECT_CMND);
        //   rawTimedWrite(0x00, LCD_REGISTER_SELECT_CMND);
        //   rawTimedWrite(0xc0, LCD_REGISTER_SELECT_CMND);
        //   rawTimedWrite(0x00, LCD_REGISTER_SELECT_CMND);
        //   rawTimedWrite(0x10, LCD_REGISTER_SELECT_CMND);
        //   rawTimedWrite(0x00, LCD_REGISTER_SELECT_CMND);
        //   rawTimedWrite(0x60, LCD_REGISTER_SELECT_CMND);
        // };

        // const LCD_LINE1 = 0;
        // const LCD_LINE2 = 1;

        // const positionCursor = (line, column) => {
        //   let cleanLine = line & 1;
        //   let cleanColumn = column & 0xf;
        //   rawTimedWrite(0x80 | (cleanLine << 6), LCD_REGISTER_SELECT_CMND);
        //   rawTimedWrite(cleanColumn << 4, LCD_REGISTER_SELECT_CMND);
        // };

        // const writeStringToLCD = (stringToDisplay) => {
        //   stringToDisplay.split("").forEach((c) => {
        //     let dataToSend = c.charCodeAt(0);
        //     rawTimedWrite(dataToSend & 0xf0, LCD_REGISTER_SELECT_CHAR);
        //     rawTimedWrite((dataToSend << 4) & 0xf0, LCD_REGISTER_SELECT_CHAR);
        //   });
        // };
      })();
    } else if (data.state === "off") {
      gpio.write(relay, false);
    } else {
      // By default we turn off the motors
      gpio.write(relay, false);
    }
  });

  // FAVORITE SONG UPDATE - Broadcast to all clients
  socket.on("favorite-update", (data) => {
    console.log("Favorite update:", data.songId, data.favorite);
    // Broadcast to all other connected clients
    socket.broadcast.emit("favorite-changed", data);
  });

  // LIGHT STRIPS FOR JUKE
  socket.on("lights", (data, callback) => {
    console.log("Lights DATA State =========>", data);

    let animationType = data.animation;
    if (data.state === "on") {
      switch (animationType) {
        case "rainbow":
          console.log("Rainbow Animation!");
          rainbow.Rainbow(data.stripConf);
          callback({
            running: true,
          });
          break;
        case "twinkle":
          console.log("Twinkle Animation!");
          twinkle.Twinkle(data.stripConf);
          callback({
            running: true,
          });
          break;
        case "colorWave":
          console.log("colorWave Animation!");
          colorWave.ColorWave(data.stripConf);
          callback({
            running: true,
          });
          break;
        case "xmas":
          console.log("Xmas Animation!");
          xmas.Xmas(data.stripConf);
          callback({
            running: true,
          });
          break;
        case "classic":
          console.log("Classic Animation!");
          classic.Classic(data.stripConf);
          callback({
            running: true,
          });
          break;
        case "fadeInOut":
          console.log("fadeInOut Animation!");
          fadeInOut.FadeInOut(data.stripConf);
          callback({
            running: true,
          });
          break;
        default:
          console.log("Empty action received.");
          break;
      }
    } else {
      switch (animationType) {
        case "rainbow":
          rainbow.RainbowPause();
          console.log("Rainbow Animation OFF!");
          callback({
            running: false,
          });
          break;
        case "twinkle":
          twinkle.TwinklePause();
          console.log("Twinkle Animation OFF!");
          callback({
            running: false,
          });
          break;
        case "colorWave":
          colorWave.ColorWavePause();
          console.log("ColorWave Animation OFF!");
          callback({
            running: false,
          });
          break;
        case "xmas":
          xmas.XmasPause();
          console.log("Xmas Animation OFF!");
          callback({
            running: false,
          });
          break;
        case "classic":
          classic.ClassicPause();
          console.log("Classic Animation OFF!");
          callback({
            running: false,
          });
          break;
        case "fadeInOut":
          fadeInOut.FadeInOutPause();
          console.log("fadeInOut Animation OFF!");
          callback({
            running: false,
          });
          break;
        default:
          console.log("Empty action received.");
          break;
      }
    }
  });
});

// SPA fallback - serve index.html for all routes (must be last)
app.use((req, res) => {
  res.sendFile(path.join(webroot, "index.html"));
});
