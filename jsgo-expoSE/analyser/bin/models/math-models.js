"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _wrappedValues = require("../values/wrapped-values");
function _default(state, ctx, model, helper) {
  var symbolicHook = helper.symbolicHook;

  /**
   * TODO: Floor and Ceil should -1 or +1 if args[0] > or < the result
   */

  model.add(Math.floor, symbolicHook(Math.floor, function (base, args) {
    return state.isSymbolic(args[0]);
  }, function (base, args, r) {
    var intArg = ctx.mkRealToInt(state.asSymbolic(args[0]));
    var floored = ctx.mkIntToReal(intArg);
    return new _wrappedValues.ConcolicValue(r, floored);
  }));
  model.add(Math.ceil, symbolicHook(Math.ceil, function (base, args) {
    return state.isSymbolic(args[0]);
  }, function (base, args, r) {
    var origin = state.asSymbolic(args[0]);
    var intArg = ctx.mkRealToInt(origin);
    var floored = ctx.mkIntToReal(intArg);
    return new _wrappedValues.ConcolicValue(r, ctx.mkIte(ctx.mkEq(floored, origin), floored, ctx.mkAdd(floored, state.asSymbolic(1))));
  }));
  model.add(Math.round, symbolicHook(Math.round, function (base, args) {
    return state.isSymbolic(args[0]);
  }, function (base, args, r) {
    var originArg = state.asSymbolic(args[0]);
    var intArg = ctx.mkRealToInt(originArg);
    var floored = ctx.mkIntToReal(intArg);
    var half = state.constantSymbol(0.5);
    var whole = state.constantSymbol(1);
    return new _wrappedValues.ConcolicValue(r, ctx.mkIte(ctx.mkLt(ctx.mkAdd(floored, half), originArg), ctx.mkAdd(floored, whole), floored));
  }));
  model.add(Math.abs, symbolicHook(Math.abs, function (base, args) {
    return state.isSymbolic(args[0]);
  }, function (base, args, r) {
    var arg_s = state.asSymbolic(args[0]);
    return new _wrappedValues.ConcolicValue(r, ctx.mkIte(ctx.mkLt(arg_s, state.asSymbolic(0)), ctx.mkUnaryMinus(arg_s), arg_s));
  }));
}
;