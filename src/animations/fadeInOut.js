const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
const common = require("./common");
const { RecurringTimer } = require("./timer");
const { Strip } = require("./strip");
const { fadeinout } = require("./common");

function FadeInOut(config) {
  let strips = config;
  // console.log(config);
  strips.forEach((item) => {
    let offset = 0;
    let theEye = [
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
      0xcc0000,
    ];
    let leds = common.num_leds();
    let eyeSize = 10;
    let LastStates = [];

    item["stripArray"] = new Strip(item).findStrip();
    item["stripTimer"] = new RecurringTimer(function() {
      for (i = item.start; i < item.stop; i++) {
        item.stripArray[i] = 0xf0b3b3;
        for (x = 0; x < eyeSize; x++) {
          //   LastStates[x] = theEye[theEye.length - 1];
          console.log(x);
          item.stripArray[i + x] = 0xcc0000;
        }

        item.stripArray[i + eyeSize + 1] = 0xf0b3b3;

        // for(int i = 0; i < NUM_LEDS-EyeSize-2; i++) {
        //     setAll(0,0,0);
        //     setPixel(i, red/10, green/10, blue/10);
        //     for(int j = 1; j <= EyeSize; j++) {
        //       setPixel(i+j, red, green, blue);
        //     }
        //     setPixel(i+EyeSize+1, red/10, green/10, blue/10);
        //     showStrip();
        //     delay(SpeedDelay);
        //   }
      }

      // some other animation
      //   for (let i = item.start; i < item.stop; i++) {
      //     item.stripArray[i] = common.fadeinout((offset + i) % 256, 0xf9f9f9);
      //   }
      //   offset = (offset + 1) % 256;

      ws281x.render();
    }, item.delay);

    this.FadeInOutPause = () => {
      strips.forEach((item) => {
        ws281x.reset(); //reset strips
        item.stripTimer.pause();
      });
    };
  });
}
module.exports = {
  FadeInOut: FadeInOut,
};
