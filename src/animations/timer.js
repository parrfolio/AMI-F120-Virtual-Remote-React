function RecurringTimer(callback, delay) {
  var timerId,
    start,
    remaining = delay;

  let pause = () => {
    console.log("Animations Paused");
    clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  let resume = () => {
    start = new Date();
    timerId = setTimeout(function() {
      remaining = delay;
      resume();
      callback();
    }, remaining);
  };

  this.resume = resume;
  this.pause = pause;

  this.resume();
}

module.exports = {
  RecurringTimer: RecurringTimer,
};
