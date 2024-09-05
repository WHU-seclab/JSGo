"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _config = _interopRequireDefault(require("./config"));
var _default2 = _interopRequireDefault(require("./strategies/default"));
var _deterministic = _interopRequireDefault(require("./strategies/deterministic"));
var _random = _interopRequireDefault(require("./strategies/random"));
var _bucketsDeterministic = _interopRequireDefault(require("./strategies/buckets-deterministic"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var _default = exports["default"] = function () {
  var strat = _config["default"].testStrategy;
  switch (strat) {
    case "default":
      return _default2["default"];
    case "deterministic":
      return _deterministic["default"];
    case "buckets_deterministic":
      return _bucketsDeterministic["default"];
    case "random":
      return _random["default"];
    default:
      throw "Strategy Error";
  }
}();