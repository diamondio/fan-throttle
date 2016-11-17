var smc = require('smc');

var numFans = smc.fans();
var savedFanSpeed = null;
var shouldCheck = true;
var checkRate = 3000;

var getMaxFanSpeed = function () {
  if (shouldCheck) {
    shouldCheck = false;
    savedFanSpeed = 0;
    for (var i = 0; i < numFans; i++) {
      var spd = smc.fanRpm(i);
      if (spd > savedFanSpeed) savedFanSpeed = spd;
    }
    setTimeout(function () {
      shouldCheck = true;
    }, checkRate);
  }
  return savedFanSpeed;
}

var maxThrottleRate = 10000; // 10 seconds
var minThrottleRate = 1;
var throttleRate = minThrottleRate;

module.exports = function (fanSpeed, cb) {
  if (getMaxFanSpeed() < fanSpeed) {
    if (throttleRate === minThrottleRate) return setImmediate(cb);
    throttleRate = Math.max(minThrottleRate, throttleRate / 2);
    return setImmediate(cb);
  }
  throttleRate = Math.min(maxThrottleRate, throttleRate * 2);
  return setTimeout(cb, throttleRate);
}

