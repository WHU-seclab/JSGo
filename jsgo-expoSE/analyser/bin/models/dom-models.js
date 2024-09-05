"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _wrappedValues = require("../values/wrapped-values");
var _log = _interopRequireDefault(require("../utilities/log"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _default(state, ctx, models, helper) {
  if (typeof window !== "undefined") {
    models.add(Element.prototype.getAttribute, helper.NoOp(Element.prototype.getAttribute));
    models.add(Element.prototype.setAttribute, helper.NoOp(Element.prototype.setAttribute));
  }
  models.add(encodeURI, function (base, args) {
    var result = new _wrappedValues.ConcolicValue(encodeURI.call(base, state.getConcrete(args[0])), state.asSymbolic(args[0]));
    return result;
  });
  models.add(encodeURIComponent, function (base, args) {
    if (state.isSymbolic(args[0])) {
      args[0] = helper.coerceToString(args[0]);
      var result = new _wrappedValues.ConcolicValue(encodeURIComponent.call(base, state.getConcrete(args[0])), state.asSymbolic(args[0]));
      return result;
    }
  });
}