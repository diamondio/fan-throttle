var assert      = require('assert');
var async       = require('async');
var path        = require('path');
var fanThrottle = require('../');

describe('Simple Tests', function () {
  beforeEach(function (done) {
    delete require.cache[path.resolve(path.join(__dirname, '../index.js'))];
    fanThrottle = require('../');
    done();
  })
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
      assert.ok(time < 20);
      done();
    });
  });
});
