"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _fileTransformer = _interopRequireDefault(require("./file-transformer"));
var _internal = _interopRequireDefault(require("./internal"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

require("colors");
function generateCoverageMap(lineInfo, callback) {
  var _loop = function _loop(filename) {
    if (!(0, _internal["default"])(filename)) {
      (0, _fileTransformer["default"])(filename).then(function (data) {
        console.log("[+] Line Coverage for ".concat(filename, " "));
        var lines = data.trim().split("\n");
        var linesWithTouched = lines.map(function (line, idx) {
          var lineNumber = idx + 1;
          var indicator = "s";
          if (lineInfo[filename].all.find(function (i) {
            return i == lineNumber;
          })) {
            if (lineInfo[filename].touched.find(function (i) {
              return i == lineNumber;
            })) {
              indicator = "+";
            } else {
              indicator = "-";
            }
          }
          var formattedLine = indicator == "-" ? line.bgRed : line.bgGreen;
          var outputLine = "".concat(lineNumber).concat(formattedLine);
          return outputLine;
        });
        linesWithTouched.forEach(function (line) {
          return callback(line);
        });
      });
    }
  };
  for (var filename in lineInfo) {
    _loop(filename);
  }
}
var _default = exports["default"] = generateCoverageMap;