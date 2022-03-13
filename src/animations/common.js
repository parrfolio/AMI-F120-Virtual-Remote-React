function common() {
  //color wheel
  this.colorwheel = (pos) => {
    pos = 255 - pos;
    if (pos < 85) {
      return this.rgb2Int(255 - pos * 3, 0, pos * 3);
    } else if (pos < 170) {
      pos -= 85;
      return this.rgb2Int(0, pos * 3, 255 - pos * 3);
    } else {
      pos -= 170;
      return this.rgb2Int(pos * 3, 255 - pos * 3, 0);
    }
  };

  this.rgb2Int = (r, g, b) => {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
  };

  this.foo = new (function() {
    console.log("FOO WORKING");
  })();

  //interval timer
  this.RecurringTimer = new (function(callback, delay) {
    var timerId,
      start,
      remaining = delay;

    var pause = function() {
      console.log("pause was called");
      clearTimeout(timerId);
      remaining -= new Date() - start;
    };

    let resume = function() {
      start = new Date();
      timerId = setTimeout(function() {
        remaining = delay;
        resume();
        //callback();
      }, remaining);
    };

    this.resume = resume;
    this.pause = pause;

    this.resume();
  })();
  //radomizer
  this.getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //RGBtoHex
  this.rgbToHex = function(r, g, b) {
    return parseInt(
      "0x" +
        this.componentToHex(r) +
        this.componentToHex(g) +
        this.componentToHex(b)
    );
  };

  this.componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };
}

module.exports = new common();
