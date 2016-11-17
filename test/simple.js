var assert      = require('assert');
var async       = require('async');
var fanThrottle = require('../');

describe('Simple Tests', function () {
  it('No throttling', function (done) {
    var l = [];
    for (var i = 0; i < 60; i++) {
      l.push(i);
    }
    var start = new Date();
    async.each(l, function (num, asyncCB) {
      fanThrottle(2000000, asyncCB);
    }, function () {
      var time = new Date() - start;
      assert.ok(time < 10);
      done();
    });
  });

  it('Large throttling', function (done) {
    var l = [];
    for (var i = 0; i < 7; i++) {
      l.push(i);
    }
    var start = new Date();
    async.each(l, function (num, asyncCB) {
      fanThrottle(2, asyncCB);
    }, function () {
      var time = new Date() - start;
      assert.ok(time > 100);
      done();
    });
  });
});