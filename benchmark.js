var assert      = require('assert');
var async       = require('async');
var path        = require('path');
var fanThrottle = require('./');

var numCycles = 100000;

var l = [];
for (var i = 0; i < numCycles; i++) {
  l.push(i);
}

console.log('Starting control test of %s items', numCycles);

var start = new Date();
async.eachSeries(l, function (num, cb) {
  setImmediate(cb);
}, function () {
  var t1 = new Date() - start;
  console.log('Without throttle: %sms', t1);
  start = new Date();
  async.eachSeries(l, function (num, cb) {
    fanThrottle(2000000, cb);
  }, function () {
    var t2 = new Date() - start;
    console.log('With throttle:   %sms', t2);
    console.log('Total overhead due to throttling: %sms per cycle', (t2-t1)/numCycles);
  });
});
