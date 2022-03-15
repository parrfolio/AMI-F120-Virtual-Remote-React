const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");
function Strip(channelSet) {
  let findStrip = function(channelSet) {
    let channelCount = channelSet.channelSet;

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

    console.log("Count", channelCount);
    console.log("array", strips[channelCount].array);
    return strips[channelCount].array;
  };

  this.findStrip = findStrip;
  this.findStrip(channelSet);

  //   this.Render = () => {
  //     ws281x.render();
  //   };
}
// module.exports = new strip();

module.exports = {
  Strip: Strip,
};
