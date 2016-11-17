var throttle = require('.');
var cp = require('child_process');
var async = require('async');

var spd = 4600;
var c = 0;

var doIt = function () {
  throttle(spd, function () {
    expensiveTask(function () {
      c++;
      console.log(c);
      doIt();
    })
  })
}

doIt();



var expensiveTask = function (cb) {
  var times = [];
  for (var i = 0; i < 10; i++) {
    times.push(i);
  }
  async.each(times, function (num, asyncCB) {
    var sources = ['./README.md'];
    cp.execFile('qlmanage', ['-ti'].concat(sources).concat(['-s100', '-o', '/tmp']), function (err, stdout, stderr) {
      asyncCB()
    });
  }, cb)
}
