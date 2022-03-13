function timer(callback, delay) {
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
    }, remaining);
  };

  this.resume = resume;
  this.pause = pause;

  this.resume();
}

module.exports = new timer();
