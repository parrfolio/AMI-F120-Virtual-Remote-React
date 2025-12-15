const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common.cjs");
const { RecurringTimer } = require("./timer.cjs");
const { Strip } = require("./strip.cjs");

let activeStrips = [];

function Pacman(config) {
  activeStrips = config;

  // Flatten every LED across all strips into a single ordered track
  const ledTrack = [];
  activeStrips.forEach((item) => {
    item["stripArray"] = new Strip(item).findStrip();
    for (let i = item.start; i < item.stop; i++) {
      ledTrack.push({ item, index: i });
    }
  });

  const trackLength = ledTrack.length;
  if (trackLength === 0) {
    return;
  }

  const setColorAtTrackIndex = (trackIndex, color) => {
    if (trackIndex < 0 || trackIndex >= trackLength) return;
    const led = ledTrack[trackIndex];
    led.item.stripArray[led.index] = color;
  };

  // Pac-Man position and state
  let pacmanPos = Math.random() * trackLength;
  const pacmanColor = 0xffff00; // Bright yellow
  const pacmanSize = 2; // Pac-Man is 2 LEDs wide
  const pacmanSpeed = 1.25; // Move 1.25 LEDs per frame
  let pacmanDirection = Math.random() < 0.5 ? 1 : -1;

  // Ghost positions and colors - random positions and directions
  const ghostColors = [0xff0000, 0xff00ff, 0x00ffff, 0xff8800];
  const ghosts = ghostColors.map((color) => ({
    pos: Math.random() * trackLength,
    color,
    size: 2,
    speed: 0.6 + Math.random() * 0.4,
    direction: Math.random() < 0.5 ? 1 : -1,
  }));

  // Dots (pellets) state - all LEDs start with dots (white)
  let dots = new Array(trackLength).fill(true);
  const dotColor = 0xffffff; // Bright white pellets
  let dotsEaten = 0;

  const wrapPosition = (value) => {
    if (value < 0) {
      return value + trackLength;
    }
    if (value >= trackLength) {
      return value - trackLength;
    }
    return value;
  };

  // Single timer drives all animations
  if (activeStrips.length > 0) {
    let firstStrip = activeStrips[0];
    firstStrip["stripTimer"] = new RecurringTimer(function () {
      // Base layer: all LEDs white if uneaten, off if eaten
      ledTrack.forEach((led, idx) => {
        led.item.stripArray[led.index] = dots[idx] ? dotColor : 0x000000;
      });

      // Move and draw ghosts (they move in any direction and try to catch Pac-Man)
      ghosts.forEach((ghost) => {
        // Ghost AI: mostly chase Pac-Man, but occasionally roam
        if (Math.random() < 0.65) {
          ghost.direction = pacmanPos > ghost.pos ? 1 : -1;
        } else if (Math.random() < 0.1) {
          ghost.direction *= -1;
        }

        ghost.pos = wrapPosition(ghost.pos + ghost.speed * ghost.direction);

        // Draw ghost (2 LEDs wide)
        for (let offset = 0; offset < ghost.size; offset++) {
          const idx = Math.floor(wrapPosition(ghost.pos + offset));
          setColorAtTrackIndex(idx, ghost.color);
        }

        // Check if ghost caught Pac-Man (circular distance)
        const distance = Math.min(
          Math.abs(ghost.pos - pacmanPos),
          trackLength - Math.abs(ghost.pos - pacmanPos)
        );
        if (distance < pacmanSize) {
          pacmanPos = Math.random() * trackLength;
          pacmanDirection = Math.random() < 0.5 ? 1 : -1;
          dots.fill(true);
          dotsEaten = 0;
        }
      });

      // Draw Pac-Man (2 LEDs wide, bright yellow)
      for (let offset = 0; offset < pacmanSize; offset++) {
        const idx = Math.floor(wrapPosition(pacmanPos + offset));
        setColorAtTrackIndex(idx, pacmanColor);
        if (dots[idx]) {
          dots[idx] = false; // Eat the dot (turn it off next frame)
          dotsEaten++;
        }
      }

      // Move Pac-Man in his current direction
      pacmanPos = wrapPosition(pacmanPos + pacmanSpeed * pacmanDirection);

      // Occasionally change Pac-Man's direction randomly
      if (Math.random() < 0.03) {
        pacmanDirection *= -1;
      }

      // If all dots eaten, respawn them and continue
      if (dotsEaten >= trackLength) {
        dots.fill(true); // Respawn all dots
        dotsEaten = 0;
      }

      ws281x.render();
    }, firstStrip.delay);
  }
}

function PacmanPause() {
  ws281x.reset();
  activeStrips.forEach((item) => {
    if (item.stripTimer) {
      item.stripTimer.pause();
    }
  });
}

module.exports = {
  Pacman: Pacman,
  PacmanPause: PacmanPause,
};
