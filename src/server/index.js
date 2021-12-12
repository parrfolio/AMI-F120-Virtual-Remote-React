const express = require("express");
const app = express();
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const gpio = require("rpi-gpio");
const gpiop = gpio.promise;
const webroot = path.resolve(__dirname, "../../dist");
app.use(express.static(webroot));

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => {
  console.log(webroot);
  console.log(`Server listening on ${PORT}`);
});

const pin = 32;
gpio.setup(pin, gpio.DIR_OUT);



io.sockets.on("connection", function(socket) {
  let direction = "cancel";
  socket.on("direction", function(data) {
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }
    direction = data;
    if (direction === "on") {
      for (let i = 0; i < 2; i++) {
        await sleep(1000)
        gpio.write(pin, true, function(err) {
          console.log(direction);
          if (err) throw err;
          setTimeout(() => {
            gpio.write(pin, false);
            console.log(direction);
          }, 200);
        });
      }
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
            await sleep(1000)
            gpio.write(pin, true, function(err) {
              console.log(direction);
              if (err) throw err;
              setTimeout(() => {
                gpio.write(pin, false);
                console.log(direction);
              }, 200);
            });
        }
      }, 3000);
    } else if (direction === "off") {
      gpio.write(pin, true);
    } else {
      // By default we turn off the motors
      gpio.write(pin, true);
    }
  });
});