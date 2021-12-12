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
  let direction = "stop"; // direction: forward, backward, stop
  socket.on("direction", function(data) {
    // Incoming data
    direction = data;
    console.log(direction);

    if (direction === "on") {
      gpio.write(pin, true); // 1 & 0 => Clockwise
    } else if (direction === "off") {
      gpio.write(pin, false); // 0 & 1 = Counter Clockwise
    } else {
      // By default we turn off the motors
      gpio.write(pin, false);
    }
  });
});
