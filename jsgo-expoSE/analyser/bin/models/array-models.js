"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _wrappedValues = require("../values/wrapped-values");
var _log = _interopRequireDefault(require("../utilities/log"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _default(state, ctx, model, helper) {
  var symbolicHook = helper.symbolicHook;
  var mkFunctionName = helper.mkFunctionName;
  var mkIndexSymbol = helper.mkIndexSymbol;
  var NoOp = helper.NoOp;
  model.add(Array.prototype.push, function (base, args) {
    var is_symbolic = state.isSymbolic(base);
    var args_well_formed = state.getConcrete(base) instanceof Array && state.arrayType(base) == _typeof(state.getConcrete(args[0]));
    if (is_symbolic && args_well_formed) {
      _log["default"].log("Push symbolic prototype");
      var array = state.asSymbolic(base);
      var value = state.asSymbolic(args[0]);
      var oldLength = array.getLength();
      var newLength = ctx.mkAdd(oldLength, ctx.mkIntVal(1));
      state.getConcrete(base).push(state.getConcrete(args[0]));
      state.updateSymbolic(base, array.setField(oldLength, value).setLength(newLength));
      return args[0];
    } else {
      //TODO: Check that this mechanism for removing-symbolicness actually works
      //TODO: The goal here is to concretize this result from here-on in as the concrete model might be non-homogonous
      if (state.isSymbolic(base)) {
        state.updateSymbolic(base, null);
      }
      return state.getConcrete(base).push(args[0]);
    }
  });
  model.add(Array.prototype.pop, function (base, args) {
    var is_symbolic = state.isSymbolic(base);
    var args_well_formed = state.getConcrete(base) instanceof Array && state.arrayType(base) == _typeof(state.getConcrete(args[0]));
    _log["default"].log("TODO: Push prototype is not smart enough to decide array type");
    if (is_symbolic && args_well_formed) {
      _log["default"].log("Push symbolic prototype");
      var array = state.asSymbolic(base);
      var oldLength = array.getLength();
      var newLength = ctx.mkAdd(oldLength, ctx.mkIntVal(-1));
      var result = new _wrappedValues.ConcolicValue(state.getConcrete(base).pop(), state.getField(oldLength));
      state.updateSymbolic(base, array.setLength(newLength));
      return result;
    } else {
      //TODO: Check this works (See push)
      if (state.isSymbolic(base)) {
        state.updateSymbolic(base, null);
      }
      return state.getConcrete(base).pop();
    }
  });
  model.add(Array.prototype.indexOf, symbolicHook(Array.prototype.indexOf, function (base, _args) {
    var is_symbolic = state.isSymbolic(base) && state.getConcrete(base) instanceof Array;
    return is_symbolic;
  }, function (base, args, result) {
    var searchTarget = state.asSymbolic(args[0]);
    var result_s = mkIndexSymbol("IndexOf");

    //The result is an integer -1 <= result_s < base.length
    state.pushCondition(ctx.mkGe(result_s, ctx.mkIntVal(-1)), true);
    state.pushCondition(ctx.mkGt(state.asSymbolic(base).getLength(), result_s), true);

    // either result_s is a valid index for the searchtarget or -1
    state.pushCondition(ctx.mkOr(ctx.mkEq(ctx.mkSelect(state.asSymbolic(base), result_s), searchTarget), ctx.mkEq(result_s, ctx.mkIntVal(-1))), true /* Binder */);

    // If result != -1 then forall 0 < i < result select base i != target
    var intSort = ctx.mkIntSort();
    var i = ctx.mkBound(0, intSort);
    var match_func_decl_name = mkFunctionName("IndexOf");
    var iLessThanResult = ctx.mkPattern([ctx.mkLt(i, result_s), ctx.mkGe(i, ctx.mkIntVal(0))]);
    var matchInArrayBody = ctx.mkImplies(ctx.mkAnd(ctx.mkGe(i, ctx.mkIntVal(0)), ctx.mkLt(i, result_s)), ctx.mkNot(ctx.mkEq(ctx.mkSelect(state.asSymbolic(base), i), searchTarget)));
    var noPriorUse = ctx.mkForAll([match_func_decl_name], intSort, matchInArrayBody, [iLessThanResult]);
    state.pushCondition(ctx.mkImplies(ctx.mkGt(result_s, ctx.mkIntVal(-1)), noPriorUse), true);
    return new _wrappedValues.ConcolicValue(result, result_s);
  }));
  model.add(Array.prototype.includes, symbolicHook(Array.prototype.includes, function (base, args) {
    var is_symbolic = state.isSymbolic(base);
    var args_well_formed = state.getConcrete(base) instanceof Array && state.arrayType(base) == _typeof(state.getConcrete(args[0]));
    return is_symbolic && args_well_formed;
  }, function (base, args, result) {
    var searchTarget = state.asSymbolic(args[0]);
    var intSort = ctx.mkIntSort();
    var i = ctx.mkBound(0, intSort);
    var lengthBounds = ctx.mkAnd(ctx.mkGe(i, ctx.mkIntVal(0)), ctx.mkLt(i, state.asSymbolic(base).getLength()));
    var body = ctx.mkAnd(lengthBounds, ctx.mkEq(ctx.mkSelect(state.asSymbolic(base), i), searchTarget));
    var iPattern = ctx.mkPattern([ctx.mkLt(i, state.asSymbolic(base).getLength()), ctx.mkGe(i, ctx.mkIntVal(0))]);
    var func_decl_name = mkFunctionName("Includes");
    var result_s = ctx.mkExists([func_decl_name], intSort, body, [iPattern]);
    return new _wrappedValues.ConcolicValue(result, result_s);
  }));
  model.add(Array.prototype.join, function (base, args) {
    // const isSymbolicVal = Array.prototype.find.call(base, x => state.isSymbolic(x));
    var isSymbolicVal = state.isSymbolicDeep(base);
    if (!isSymbolicVal) {
      return Array.prototype.join.apply(base, args);
    }
    var sep = args[0] ? helper.coerceToString(args[0]) : ',';
    var finalString = '';
    for (var i = 0; i < base.length; i++) {
      if (i > 0) {
        finalString = state.binary('+', finalString, sep);
      }
      finalString = state.binary('+', finalString, helper.coerceToString(base[i]));
    }
    return finalString;
  });

  /** jackfromeast
   * 
   * Array.prototype.toString is a special case of Array.prototype.join(',')
   * 
   * FIXME: there are two cases:
   * 1/ the array is symbolic
   * 2/ the array is concrete, but one of its elements is symbolic
   * 
   * Probobly, we other modeled function also has this issue
   */
  model.add(Array.prototype.toString, function (base, _args) {
    // const isSymbolicVal = Array.prototype.find.call(base, x => state.isSymbolic(x));
    var isSymbolicVal = state.isSymbolicDeep(base);
    if (!isSymbolicVal) {
      return Array.prototype.toString.call(base);
    }
    var sep = ',';
    var finalString = '';
    if (state.isSymbolic(base)) {} else {
      for (var i = 0; i < base.length; i++) {
        if (i > 0) {
          finalString = state.binary('+', finalString, sep);
        }
        finalString = state.binary('+', finalString, helper.coerceToString(base[i]));
      }
    }
    return finalString;
  });
  model.add(Array.prototype.keys, NoOp(Array.prototype.keys));
  model.add(Array.prototype.concat, NoOp(Array.prototype.concat));
  model.add(Array.prototype.forEach, NoOp(Array.prototype.forEach)); //TODO: This should only be a no op if the function given as a forEach is not native
  model.add(Array.prototype.filter, NoOp(Array.prototype.filter)); //TODO: This should only be a no op if the function given as a filter  is not native
  model.add(Array.prototype.map, NoOp(Array.prototype.map)); // ^^
  model.add(Array.prototype.shift, NoOp(Array.prototype.shift));
  model.add(Array.prototype.unshift, NoOp(Array.prototype.unshift));
  model.add(Array.prototype.fill, NoOp(Array.prototype.fill));
  model.add(Array.prototype.reduce, NoOp(Array.prototype.reduce)); //TODO: This should only be a no-op if the function given as a reducer is not native 
}