"use strict";

var _center = _interopRequireDefault(require("./center"));
var _config = _interopRequireDefault(require("./config"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * This is the entry point of the frontend
 */

process.title = "expoSE+ frontend";
process.on("disconnect", function () {
  console.log("Premature termination - Parent exit");
  process.exit();
});
if (process.argv.length >= 3) {
  var target = process.argv[process.argv.length - 1];
  var initialInput = undefined;
  if (_config["default"].input) {
    initialInput = JSON.parse(_config["default"].input);
  }
  console.log("[+] ExpoSE ".concat(target, " concurrent: ").concat(_config["default"].maxConcurrent, " timeout: ").concat(_config["default"].maxTime, " per-undefined: ").concat(_config["default"].undefMaxTime, " per-test: ").concat(_config["default"].testMaxTime));
  var center = new _center["default"]();
  process.on("SIGINT", function () {
    /** nice catch for sigint */
    center.cancel();
  });
  var maxTimeout = setTimeout(function () {
    center.cancel();
  }, _config["default"].maxTime);
  center.start(target, initialInput); /** this is synchronous */

  clearTimeout(maxTimeout);
} else {
  console.log("USAGE: ".concat(process.argv[0], " ").concat(process.argv[1], " target (Optional: initial input)"));
}