const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
function Strip(config) {
  console.log("FULL CONFIG OUTSIDE FINDSTRIP", config);
  let findStrip = function(config) {
    let channelCount = config.channelSet;
    console.log("FULL CONFIG INSIDE FINDSTRIP", config);
    console.log(channelCount);
    let ledCount = 300;
    let strips = ws281x.init({
      dma: 10,
      freq: 800000,
      channels: [
        {
          count: ledCount,
          gpio: 18,
          invert: false,
          brightness: 255,
          stripType: "ws2812",
        },
        {
          count: ledCount,
          gpio: 13,
          invert: false,
          brightness: 255,
          stripType: "ws2812",
        },
      ],
    });

    console.log("COUNT", channelCount);
    console.log("ARRAY", strips[channelCount].array);
    return strips[channelCount].array;
  };

  this.findStrip = findStrip;
  this.findStrip(config);

  //   this.Render = () => {
  //     ws281x.render();
  //   };
}
// module.exports = new strip();

module.exports = {
  Strip: Strip,
};
