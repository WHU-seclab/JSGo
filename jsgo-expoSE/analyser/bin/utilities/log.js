"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _config = _interopRequireDefault(require("../config"));
var _safeJson = require("./safe-json");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
var fs = require("fs");
function makeid(count) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < count; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
var path_dump_id = makeid(4);
var log_path = console.log;

/**
 * Class to handle logging
 * Structured this way for historical reasons, unneeded 
 * logs are now removed at compile for performance
 */

// analyzer's log should use blue color
// sink's log should use red color
var Log = /*#__PURE__*/function () {
  function Log() {
    _classCallCheck(this, Log);
  }
  return _createClass(Log, [{
    key: "logHigh",
    value: function logHigh(msg) {
      log_path("\x1b[34m%s\x1b[0m", "[?] " + msg);
    }
  }, {
    key: "logMid",
    value: function logMid(msg) {
      log_path("\x1b[34m%s\x1b[0m", "[?] " + msg);
    }
  }, {
    key: "log",
    value: function log(msg) {
      log_path("\x1b[34m%s\x1b[0m", "[+] " + msg);
    }

    // lzy
  }, {
    key: "logPC",
    value: function logPC(msg) {
      log_path("\x1b[33m%s\x1b[0m", "[+] " + msg);
    }
  }, {
    key: "logUndefined",
    value: function logUndefined(msg) {
      log_path("\x1b[32m%s\x1b[0m", "[+] " + msg);
    }

    // lzy
  }, {
    key: "logSink",
    value: function logSink(msg) {
      log_path("\x1b[31m%s\x1b[0m", "[!] " + msg);
    }
  }, {
    key: "logQuery",
    value: function logQuery(clause, solver, checkCount, startTime, endTime, model, attempts, hitMax) {
      if (!_config["default"].outQueriesDir) {
        return;
      }
      var dumpData = {
        clause: clause,
        model: model,
        attempts: attempts,
        startTime: startTime,
        endTime: endTime,
        hitMaxRefinements: hitMax,
        checkCount: checkCount,
        containedRe: (solver + clause).includes("str.in.re")
      };
      var dumpFileName = _config["default"].outQueriesDir + "/" + path_dump_id;
      fs.appendFileSync(dumpFileName, (0, _safeJson.stringify)(dumpData) + "\nEXPOSE_QUERY_DUMP_SEPERATOR\n");
      this.log("Wrote ".concat(dumpFileName));
    }
  }]);
}();
var _default = exports["default"] = new Log();