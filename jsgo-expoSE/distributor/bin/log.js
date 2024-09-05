"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
var MOVE_UP = new Buffer("1b5b3141", "hex").toString();
var CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();

/**
 * Mock to remove dependency on stringWidth
 * Will be correct as long as no unicode is used?
 */
function stringWidth(str) {
  return str.len;
}
var Logger = function Logger(stream) {
  var write = stream.write;
  var str;
  stream.write = function (data) {
    if (str && data !== str) str = null;
    return write.apply(this, arguments);
  };
  if (stream === process.stderr || stream === process.stdout) {
    process.on("exit", function () {
      if (str !== null) stream.write("");
    });
  }
  var prevLineCount = 0;
  var log = function log() {
    str = "";
    var nextStr = Array.prototype.join.call(arguments, " ");

    // Clear screen
    for (var i = 0; i < prevLineCount; i++) {
      str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount - 1 ? MOVE_UP : "");
    }

    // Actual log output
    str += nextStr;
    stream.write(str);

    // How many lines to remove on next clear screen
    var prevLines = nextStr.split("\n");
    prevLineCount = 0;
    for (var _i = 0; _i < prevLines.length; _i++) {
      prevLineCount += Math.ceil(stringWidth(prevLines[_i]) / stream.columns) || 1;
    }
  };
  log.clear = function () {
    stream.write("");
  };
  return log;
};
var DefaultLogger = Logger(process.stdout);
var lastStep = 0;
function nextStep(i) {
  switch (i) {
    case 0:
      return "-";
    case 1:
      return "\\";
    case 2:
      return "|";
    case 3:
      return "/";
    case 4:
      return "-";
    case 5:
      return "\\";
    case 6:
      return "|";
    case 7:
      return "/";
  }
}
function _default(line) {
  //Log with the current step of the spinner
  DefaultLogger("[".concat(nextStep(lastStep++), "] ").concat(line));

  //Check for spinner reset
  if (lastStep == 8) {
    lastStep = 0;
  }
}