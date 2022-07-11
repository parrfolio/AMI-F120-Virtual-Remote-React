const express = require("express");
const app = express();
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const gpio = require("rpi-gpio");
const webroot = path.resolve(__dirname, "../../dist");
const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const i2c = require("i2c-bus");
const sleepMore = require("sleep");

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

//for routing
app.get("*", function (req, res) {
  res.sendFile("index.html", {
    root: webroot,
  });
});
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`Running at ${addresses}:${PORT} from ${webroot}`);
});

process.on("SIGINT", function () {
  ws281x.reset();
  ws281x.finalize();

  process.nextTick(function () {
    process.exit(0);
  });
});

//Light animations
const rainbow = require("../animations/rainbow");
const twinkle = require("../animations/twinkle");
const colorWave = require("../animations/colorWave");
const xmas = require("../animations/xmas");
const classic = require("../animations/classic");
const fadeInOut = require("../animations/fadeInOut");

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
    console.log("DATA: ", data);
    console.log("Selection", data.select.selection);
    console.log("===-- SELECTION --===", data.select.selection);
    console.log(
      "===-- Pulse Train Rel --===",
      data.select.ptrains[0],
      data.select.ptrains[1]
    );

    if (data.select.state === "on") {
      //pulse train 1
      (async () => {
        console.log("=======-- Train 1 START --=======");
        for (let i = 0; i < data.select.ptrains[0]; i++) {
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
        await sleep(data.select.ptrainDelay);
        console.log("=======-- Train 2 START --=======");
        for (let i = 0; i < data.select.ptrains[1]; i++) {
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
        console.log("CALLBACK FIRED!");

        //lcd readout
        const LCD_IC2_ADDRESS = 0x27;
        const IC2_BUS_NUMBER = 1;
        const LCD_BACKLIGHT = 0x08;
        const LCD_REGISTER_SELECT_CMND = 0x00;
        const LCD_REGISTER_SELECT_CHAR = 0x01;
        const LCD_ENABLE = 0x04;

        const IC2_bus = i2c.open(IC2_BUS_NUMBER, (err) => {
          if (err) {
            console.log("Error opening I2C bus", err);
            process.exit(1);
          }

          initializeLCD();
          positionCursor(LCD_LINE1, 0);
          writeStringToLCD(data.songTitle);
          positionCursor(LCD_LINE2, 0);
          writeStringToLCD(
            "Track" + data.select.selection.toString() + " Side " + data.side
          );
        });

        const handleI2CError = (err, bytesWritten, buffer) => {
          if (err) {
            console.log("Error writing to I2C bus", err);
          }
        };

        const rawTimedWrite = (dataInUpperNibble, cmndOrChar) => {
          let cleanData = dataInUpperNibble & 0xf0;
          let cleanRS = cmndOrChar & 0x1;
          IC2_bus.i2cWrite(
            LCD_IC2_ADDRESS,
            1,
            Buffer.from([cleanData | LCD_BACKLIGHT | cleanRS]),
            handleI2CError
          );
          sleepMore.msleep(10);
          IC2_bus.i2cWrite(
            LCD_IC2_ADDRESS,
            1,
            Buffer.from([cleanData | LCD_BACKLIGHT | LCD_ENABLE | cleanRS]),
            handleI2CError
          );
          sleepMore.msleep(10);
          IC2_bus.i2cWrite(
            LCD_IC2_ADDRESS,
            1,
            Buffer.from([cleanData | LCD_BACKLIGHT | cleanRS]),
            handleI2CError
          );

          // (async () => {
          //   await sleep(200);
          // })();
          sleepMore.msleep(20);
        };

        const initializeLCD = () => {
          sleepMore.msleep(80);
          rawTimedWrite(0x30, LCD_REGISTER_SELECT_CMND);
          sleepMore.usleep(60);
          rawTimedWrite(0x30, LCD_REGISTER_SELECT_CMND);
          sleepMore.usleep(60);
          rawTimedWrite(0x30, LCD_REGISTER_SELECT_CMND);
          sleepMore.usleep(30);
          rawTimedWrite(0x30, LCD_REGISTER_SELECT_CMND);
          rawTimedWrite(0x20, LCD_REGISTER_SELECT_CMND);
          rawTimedWrite(0x20, LCD_REGISTER_SELECT_CMND);
          rawTimedWrite(0x80, LCD_REGISTER_SELECT_CMND);
          rawTimedWrite(0x00, LCD_REGISTER_SELECT_CMND);
          rawTimedWrite(0xc0, LCD_REGISTER_SELECT_CMND);
          rawTimedWrite(0x00, LCD_REGISTER_SELECT_CMND);
          rawTimedWrite(0x10, LCD_REGISTER_SELECT_CMND);
          rawTimedWrite(0x00, LCD_REGISTER_SELECT_CMND);
          rawTimedWrite(0x60, LCD_REGISTER_SELECT_CMND);
        };

        const LCD_LINE1 = 0;
        const LCD_LINE2 = 1;

        const positionCursor = (line, column) => {
          let cleanLine = line & 1;
          let cleanColumn = column & 0xf;
          rawTimedWrite(0x80 | (cleanLine << 6), LCD_REGISTER_SELECT_CMND);
          rawTimedWrite(cleanColumn << 4, LCD_REGISTER_SELECT_CMND);
        };

        const writeStringToLCD = (stringToDisplay) => {
          stringToDisplay.split("").forEach((c) => {
            let dataToSend = c.charCodeAt(0);
            rawTimedWrite(dataToSend & 0xf0, LCD_REGISTER_SELECT_CHAR);
            rawTimedWrite((dataToSend << 4) & 0xf0, LCD_REGISTER_SELECT_CHAR);
          });
        };

        // backlight blinking
        // const backlightControl = (onoff) => {
        //   if (onoff) {
        //     IC2_bus.i2cWrite(
        //       LCD_IC2_ADDRESS,
        //       1,
        //       Buffer.from([LCD_BACKLIGHT]),
        //       handleI2CError
        //     );
        //   } else {
        //     IC2_bus.i2cWrite(LCD_IC2_ADDRESS, 1, Buffer.from([0]), handleI2CError);
        //   }
        // };
        // let backlightCondition = true;
        // setInterval(() => {
        //   backlightCondition = !backlightCondition;
        //   backlightControl(backlightCondition);
        // }, 1000);
      })();
    } else if (data.select.state === "off") {
      gpio.write(relay, false);
    } else {
      // By default we turn off the motors
      gpio.write(relay, false);
    }
  });

  // LIGHT STRIPS FOR JUKE
  socket.on("lights", (data, callback) => {
    console.log("Lights", data.state);

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
