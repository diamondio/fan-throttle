var smc = require('smc');

var numFans = smc.fans();
var savedFanSpeed = null;
var shouldCheck = true;
var checkRate = 300;

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
var prevVal = 0;

var integ = 0;

var p = 1;
var i = 0.005;
var d = 20;


var integCap = 1000 / i;

module.exports = function (fanSpeed, cb) {
  var currentFan = getMaxFanSpeed();
  var val = currentFan - fanSpeed;
  if (!prevVal) prevVal = val;
  var derriv = val - prevVal;
  integ += val;
  if (integ > integCap) integ = integCap;
  if (integ < -integCap) integ = -integCap;

  var waitTime = p * val + i * integ + d * derriv;
  if (waitTime > maxThrottleRate) waitTime = maxThrottleRate;
  /*
  console.log(`
P: ${val * p},
I: ${integ * i},
D: ${derriv * d}
`);*/

  setTimeout(cb, waitTime);

  prevVal = val;
}

