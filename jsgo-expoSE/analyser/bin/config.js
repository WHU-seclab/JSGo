"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _external = _interopRequireDefault(require("./external"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var process = _external["default"].load("process");
function Default(i, d) {
  var envvar = process.env["EXPOSE_".concat(i)];
  return envvar || d;
}
var _default = exports["default"] = {
  incrementalSolverEnabled: !!Default("USE_INCREMENTAL_SOLVER", true),
  maxRefinements: Number.parseInt(Default("MAX_REFINEMENTS", "40")),
  maxSolverTime: Number.parseInt(Default("MAX_SOLVER_TIME", 1800000)),
  regexEnabled: !Default("DISABLE_REGULAR_EXPRESSIONS", false),
  capturesEnabled: !Default("DISABLE_CAPTURE_GROUPS", false),
  refinementsEnabled: !Default("DISABLE_REFINEMENTS", false),
  outFilePath: Default("OUT_PATH", undefined),
  outCoveragePath: Default("COVERAGE_PATH", undefined),
  outQueriesDir: Default("QUERY_DUMP", undefined),
  stringSolver: Default("STRING_SOLVER", "seq")
};