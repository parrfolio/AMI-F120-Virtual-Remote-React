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

  //color wave
  const ledCount = 332;

  this.ColorWave = (ledstrip) => {
    this.ledstrip = ledstrip;

    this.direction = 1;
    // tick counter
    this.t = 0;

    return this;
  };

  this.map2PI = function(tick) {
    return (Math.PI * 2 * tick) / ledCount;
  };

  this.scale = function(val) {
    val += 1;
    val *= 255 / 2;

    return Math.floor(val);
  };

  this.wave = function(tick) {
    var i,
      j,
      rsin,
      gsin,
      bsin,
      size = ledCount,
      offset = this.map2PI(tick);

    if (Math.random() > 0.999) this.direction *= -1;

    for (i = 0; i < size; i++) {
      j = this.map2PI(i * this.direction) + offset;
      rsin = Math.sin(j);
      gsin = Math.sin((2 * j) / 3 + this.map2PI(size / 6));
      bsin = Math.sin((4 * j) / 5 + this.map2PI(size / 3));

      this.ledstrip.buffer[i] = [
        this.scale(rsin),
        this.scale(gsin),
        this.scale(bsin),
      ];
    }
  };

  //rgb2Int
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
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };
}

module.exports = new common();
