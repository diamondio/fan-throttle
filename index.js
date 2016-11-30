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
      //console.log('Speed is', spd);
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
var i = 0.09;
var d = 50;


var integHighCap = 10000 / i;
var integLowCap = 200 / i;

module.exports = function (fanSpeed, cb) {
  var currentFan = getMaxFanSpeed();
  var val = currentFan - fanSpeed;
  if (!prevVal) prevVal = val;
  var derriv = val - prevVal;
  integ += val;
  if (integ > integHighCap) integ = integHighCap;
  if (integ < -integLowCap) integ = -integLowCap;

  var waitTime = p * val + i * integ + d * derriv;
  if (waitTime > maxThrottleRate) waitTime = maxThrottleRate;
/*
  console.log(`
P: ${val * p},
I: ${integ * i},
D: ${derriv * d}
`);*/

  if (waitTime < 0) {
    setImmediate(cb);
  } else {
    setTimeout(cb, waitTime);
  }

  prevVal = val;
}

