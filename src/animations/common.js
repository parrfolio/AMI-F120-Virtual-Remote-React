function common() {
  //total leds
  this.num_leds = () => {
    return 332;
  };
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

  //cylon
  this.cylon = (pos, color, totalLeds, eyeSize) => {
    pos = totalLeds - pos;

    if (pos < eyeSize) {
      return this.rgb2Int(204 - pos, 0, pos * 2);
    }
  };

  //fade in and out
  this.fadeinout = (pos, color) => {
    pos = 255 - pos;

    if (pos < 150) {
      return color;
    } else {
      pos -= 150;
      return 0xff0f00;
    }
  };

  this.rgb2Int = (r, g, b) => {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
  };

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
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  //christmas
  let XmasRed = 0xff0000;
  let XmasGreen = 0x00ff00;
  let XmasBlue = 0x0000ff;
  let XmasWhite = 0xffffff;

  this.RandomXmasColor = function() {
    let xmasLight = this.getRandomInt(1, 4);
    let xmasColor = XmasRed;
    switch (xmasLight) {
      case 1:
        xmasColor = XmasRed;
        break;
      case 2:
        xmasColor = XmasGreen;
        break;
      case 3:
        xmasColor = XmasBlue;
        break;
      case 4:
        xmasColor = XmasWhite;
        break;
    }
    return xmasColor;
  };
}

module.exports = new common();
