const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common.cjs");
const { RecurringTimer } = require("./timer.cjs");
const { Strip } = require("./strip.cjs");

let activeStrips = [];

function CylonEye(config) {
  activeStrips = config;

  // Eye animation state for cabinet_ami_logo
  let eyeOffset = 0;
  let eyeSize = 8;
  let reversing = false;

  // Find the cabinet_ami_logo strip
  let logoStrip = activeStrips.find((item) => item.name === "cabinet_ami_logo");
  let logoStripLength = logoStrip ? logoStrip.stop - logoStrip.start : 32;
  let logoStripStart = logoStrip ? logoStrip.start : 204;

  // Pulsing red state for other strips
  let pulseValue = 0;
  let pulseDirection = 1;
  let pulseSpeed = 3;

  // Red color variations for pulsing effect
  const redShades = [
    0x330000, // darkest
    0x660000,
    0x990000,
    0xcc0000,
    0xff0000, // brightest
  ];

  activeStrips.forEach((item) => {
    item["stripArray"] = new Strip(item).findStrip();
  });

  // Single timer drives all animations
  if (activeStrips.length > 0) {
    let firstStrip = activeStrips[0];
    firstStrip["stripTimer"] = new RecurringTimer(function () {
      activeStrips.forEach((item) => {
        if (item.name === "cabinet_ami_logo") {
          // Cylon eye effect on logo
          for (let i = item.start; i < item.stop; i++) {
            let localPos = i - item.start;
            item.stripArray[i] = common.cylon(
              (eyeOffset + localPos) % logoStripLength,
              0xff2400, // Firecracker red
              logoStripLength,
              eyeSize
            );
          }
        } else {
          // Pulsing red effect on other strips
          let shadeIndex = Math.floor(
            (pulseValue / 255) * (redShades.length - 1)
          );
          let color = redShades[shadeIndex];

          for (let i = item.start; i < item.stop; i++) {
            item.stripArray[i] = color;
          }
        }
      });

      // Move the eye back and forth on the logo
      if (!reversing) {
        eyeOffset++;
        if (eyeOffset >= logoStripLength - eyeSize) {
          reversing = true;
        }
      } else {
        eyeOffset--;
        if (eyeOffset <= 0) {
          reversing = false;
        }
      }

      // Pulse the red on other strips
      pulseValue += pulseSpeed * pulseDirection;
      if (pulseValue >= 255) {
        pulseValue = 255;
        pulseDirection = -1;
      } else if (pulseValue <= 0) {
        pulseValue = 0;
        pulseDirection = 1;
      }

      ws281x.render();
    }, firstStrip.delay);
  }
}

function CylonEyePause() {
  ws281x.reset();
  activeStrips.forEach((item) => {
    if (item.stripTimer) {
      item.stripTimer.pause();
    }
  });
}

module.exports = {
  CylonEye: CylonEye,
  CylonEyePause: CylonEyePause,
};
