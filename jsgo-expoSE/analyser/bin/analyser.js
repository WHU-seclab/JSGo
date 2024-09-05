"use strict";

var _symbolicExecution = _interopRequireDefault(require("./symbolic-execution"));
var _config = _interopRequireDefault(require("./config"));
var _log = _interopRequireDefault(require("./utilities/log"));
var _external = _interopRequireDefault(require("./external"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

/*global J$*/

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT
//
// Symbolic execution analyser entry point

var fs = _external["default"].load("fs");
var process = _external["default"].load("process");

// const withHelper = process.argv[process.argv.length - 5];
// const withChain = process.argv[process.argv.length - 4];
var input = process.argv[process.argv.length - 3];
var undefinedUnderTest = process.argv[process.argv.length - 2];
var inherit = process.argv[process.argv.length - 1];
_log["default"].log("Built with BASE logging enabled");
_log["default"].log("Intial Input " + input);
process.title = "expoSE+ worker";
process.on("disconnect", function () {
  _log["default"].log("Premature termination - Parent exit");
  process.exit();
});
J$.analysis = new _symbolicExecution["default"](J$, JSON.parse(input), JSON.parse(undefinedUnderTest), JSON.parse(inherit), function (state, coverage) {
  // We record the alternatives list as the results develop to make the output tool more resilient to SMT crashes
  state.alternatives(function (current) {
    var finalOut = {
      pc: state.finalPC(),
      pcString: state.finalPC().toString(),
      input: state.input,
      errors: state.errors,
      alternatives: current,
      undefinedPool: state.undefinedPool,
      undefinedUT: state.undefinedUnderTest,
      helperPool: state.retHelper ? state.helperCandidates : [],
      successHelper: state.withHelper && !state.retHelper ? state.withHelper : undefined,
      forinLoad: state.forinLoad,
      stats: state.stats["export"](),
      result: state.result
    };
    if (_config["default"].outFilePath) {
      fs.writeFileSync(_config["default"].outFilePath, JSON.stringify(finalOut));
      _log["default"].log("Wrote final output to " + _config["default"].outFilePath);
    } else {
      _log["default"].log("No final output path supplied");
    }
  });
  _log["default"].logPC("Finished play with PC " + state.pathCondition.map(function (x) {
    return x.ast;
  }));
  if (_config["default"].outCoveragePath) {
    fs.writeFileSync(_config["default"].outCoveragePath, JSON.stringify(coverage.end()));
    _log["default"].log("Wrote final coverage to " + _config["default"].outCoveragePath);
  } else {
    _log["default"].log("No final coverage path supplied");
  }
});