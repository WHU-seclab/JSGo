"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _child_process = require("child_process");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
var tmp = require("tmp");
var fs = require("fs");
var _kill = require("tree-kill");
var EXPOSE_REPLAY_PATH = "expoSE replay";
var Spawn = /*#__PURE__*/function () {
  function Spawn(script, file, opts) {
    _classCallCheck(this, Spawn);
    this.script = script;
    this.file = file;
    this.options = opts;
    var inherit = {
      undefinedPool: opts.undefinedPool,
      withHelper: this.file.withHelper || false,
      withChain: this.file.withChain || false,
      forinLoad: this.file.forinLoad || false,
      forinKeys: this.file.forinKeys || [],
      forinKeyBound: this.file.forinKeyBound || 0
    };
    this.args = [this.file.path, JSON.stringify(this.file.input), JSON.stringify(this.file.undefinedUT), JSON.stringify(inherit)];
    // this.args = [this.file.path, JSON.stringify(this.file.input)];
    this.tmpCoverageFile = tmp.fileSync();
    this.tmpOutFile = tmp.fileSync();
    this.env = JSON.parse(JSON.stringify(process.env));
    this.env.EXPOSE_OUT_PATH = this.tmpOutFile.name;
    this.env.EXPOSE_COVERAGE_PATH = this.tmpCoverageFile.name;
  }
  return _createClass(Spawn, [{
    key: "_tryParse",
    value: function _tryParse(data, type, errors) {
      try {
        return JSON.parse(data);
      } catch (e) {
        errors.push({
          error: "Exception E: " + e + " of " + type + " on " + data
        });
        return null;
      }
    }
  }, {
    key: "startTime",
    value: function startTime() {
      return this._startTime;
    }
  }, {
    key: "endTime",
    value: function endTime() {
      return this._endTime;
    }
  }, {
    key: "time",
    value: function time() {
      return this._endTime - this._startTime;
    }
  }, {
    key: "_recordEndTime",
    value: function _recordEndTime() {
      this._endTime = Date.now();
    }
  }, {
    key: "_processEnded",
    value: function _processEnded(code, done) {
      this._recordEndTime();
      var me = this;
      var errors = [];
      var coverage = null;
      var finalOut = null;
      var count = 0;
      var test = this;
      function cb(err) {
        count++;
        if (err) {
          errors.push({
            error: err
          });
        }
        if (count == 2) {
          test.tmpOutFile.removeCallback();
          test.tmpCoverageFile.removeCallback();
          done(me, code, test, finalOut, coverage, errors);
        }
      }
      fs.readFile(this.tmpOutFile.name, {
        encoding: "utf8"
      }, function (err, data) {
        if (!err) {
          finalOut = test._tryParse(data, "test data", errors);
        }
        cb(err);
      });
      fs.readFile(this.tmpCoverageFile.name, {
        encoding: "utf8"
      }, function (err, data) {
        if (!err) {
          coverage = test._tryParse(data, "coverage data", errors);
        }
        cb(err);
      });
    }
  }, {
    key: "shellescape",
    value: function shellescape(a) {
      var ret = [];
      a.forEach(function (s) {
        if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
          s = "'" + s.replace(/'/g, "'\\''") + "'";
        }
        ret.push(s);
      });
      return ret.join(" ");
    }
  }, {
    key: "_mkEnvReplay",
    value: function _mkEnvReplay() {
      var envStr = "";
      for (var i in this.env) {
        envStr += i + "=\"" + this.env[i] + "\" ";
      }
      return envStr;
    }
  }, {
    key: "makeReplayString",
    value: function makeReplayString() {
      // replay igonre the undefined pool
      return /* this._mkEnvReplay() + */EXPOSE_REPLAY_PATH + " " + this.shellescape(this.args.slice(0, 2));
    }
  }, {
    key: "kill",
    value: function kill() {
      _kill(this._pid, "SIGKILL");
    }
  }, {
    key: "_buildTimeout",
    value: function _buildTimeout() {
      var _this = this;
      return setTimeout(function () {
        _this.kill();
      }, this.options.timeout);
    }
  }, {
    key: "start",
    value: function start(done) {
      var _this2 = this;
      this._startTime = Date.now();
      try {
        var stdio = this.options.log ? ["ignore", "inherit", "inherit"] : ["ignore", "ignore", "ignore"];
        var prc = (0, _child_process.spawn)(this.script, this.args, {
          stdio: stdio,
          env: this.env,
          disconnected: false
        });
        prc.on("exit", function (code) {
          clearTimeout(_this2._killTimeout);
          _this2._processEnded(code, done);
        });
        this._killTimeout = this._buildTimeout();
        this._pid = prc.pid;
      } catch (ex) {
        console.log("Distributor ERROR: " + ex + " just falling back to default error");
        this._processEnded(99999, done);
      }
      return this;
    }
  }]);
}();
var _default = exports["default"] = Spawn;