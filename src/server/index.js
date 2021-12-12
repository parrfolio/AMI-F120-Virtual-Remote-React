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

const pin = 32;
gpio.setup(pin, gpio.DIR_OUT);

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

io.sockets.on("connection", function(socket) {
  let direction = "cancel";
  socket.on("direction", function(data) {
    direction = data;
    if (direction === "on") {
      (async function() {
        for (let i = 0; i < 2; i++) {
          await sleep(300);
          gpio.write(pin, false, function(err) {
            console.log("on");
            if (err) throw err;
            (async function() {
              await sleep(200);
              gpio.write(pin, true);
              console.log("off");
            })();
          });
        }
      })();

      setTimeout(() => {
        (async function() {
          for (let i = 0; i < 10; i++) {
            await sleep(300);
            gpio.write(pin, false, function(err) {
              console.log("on");
              if (err) throw err;
              (async function() {
                await sleep(200);
                gpio.write(pin, true);
                console.log("off");
              })();
            });
          }
        })();
      }, 2500);
    } else if (direction === "off") {
      gpio.write(pin, false);
    } else {
      // By default we turn off the motors
      gpio.write(pin, true);
    }
  });
});
