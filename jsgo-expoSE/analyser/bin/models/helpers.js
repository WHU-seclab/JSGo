"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _config = _interopRequireDefault(require("../config"));
var _wrappedValues = require("../values/wrapped-values");
var _log = _interopRequireDefault(require("../utilities/log"));
var _objectHelper = _interopRequireDefault(require("../utilities/object-helper"));
var _IsNative = require("../utilities/IsNative");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var map = Array.prototype.map;
function _default(state, ctx, model) {
  function runMethod(f, base, args) {
    var concretize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var result, thrown;

    //Defer throw until after hook has run
    try {
      var c_base = concretize ? state.getConcrete(base) : base;
      var c_args = concretize ? map.call(args, function (arg) {
        return state.getConcrete(arg);
      }) : args;
      result = f.apply(c_base, c_args);
    } catch (e) {
      thrown = e;
    }
    return [result, thrown];
  }

  /**
   * Symbolic hook is a helper function which builds concrete results and then,
   * if condition() -> true executes a symbolic helper specified by hook
   * Both hook and condition are called with (context (SymbolicExecutor), f, base, args, result)
   *
   * A function which makes up the new function model is returned
   */
  function symbolicHook(f, condition, hook) {
    var concretize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var featureDisabled = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    return function (base, args) {
      var _runMethod = runMethod(f, base, args, concretize),
        _runMethod2 = _slicedToArray(_runMethod, 2),
        result = _runMethod2[0],
        thrown = _runMethod2[1];
      if (!featureDisabled && condition(base, args)) {
        result = hook(base, args, result);
      }
      if (thrown) {
        throw thrown;
      }
      return result;
    };
  }
  function ConcretizeIfNative(f) {
    return function (base, args) {
      base = state.getConcrete(base);
      if ((0, _IsNative.isNative)(base)) {
        var concretized = state.concretizeCall(f, base, args, false);
        base = concretized.base;
        args = concretized.args;
      }
      return f.apply(base, args);
    };
  }
  function coerceToString(symbol) {
    return state.ToString(symbol);
  }
  function NoOp(f) {
    return function (base, args) {
      return f.apply(base, args);
    };
  }

  /**
   * In JavaScript slice and substr can be given a negative index to indicate addressing from the end of the array
   * We need to rewrite the SMT to handle these cases
   */
  function substringHandleNegativeLengths(base_s, index_s) {
    //Index s is negative to adding will get us to the right start
    var newIndex = ctx.mkAdd(base_s.getLength(), index_s);

    //Bound the minimum index by 0
    var aboveMin = ctx.mkGe(newIndex, ctx.mkIntVal(0));
    var indexOrZero = ctx.mkIte(aboveMin, newIndex, ctx.mkIntVal(0));
    return ctx.mkIte(ctx.mkGe(index_s, ctx.mkIntVal(0)), index_s, indexOrZero);
  }
  function substringHelper(base, args, result) {
    state.stats.seen("Symbolic Substrings");
    var target = state.asSymbolic(base);

    //The start offset is either the argument of str.len - the arguments
    var start_off = ctx.mkRealToInt(state.asSymbolic(args[0]));
    start_off = substringHandleNegativeLengths(target, start_off);

    //Length defaults to the entire string if not specified
    var len;
    var maxLength = ctx.mkSub(target.getLength(), start_off);
    if (args[1]) {
      len = state.asSymbolic(args[1]);
      len = ctx.mkRealToInt(len);

      //If the length is user-specified bound the length of the substring by the maximum size of the string ("123".slice(0, 8) === "123")
      var exceedMax = ctx.mkGe(ctx.mkAdd(start_off, len), target.getLength());
      len = ctx.mkIte(exceedMax, maxLength, len);
    } else {
      len = maxLength;
    }

    //If the start index is greater than or equal to the length of the string the empty string is returned
    var substr_s = ctx.mkSeqSubstr(target, start_off, len);
    var empty_s = ctx.mkString("");
    var result_s = ctx.mkIte(ctx.mkGe(start_off, target.getLength()), empty_s, substr_s);
    return new _wrappedValues.ConcolicValue(result, result_s);
  }
  var indexOfCounter = 0;
  function mkIndexSymbol(op) {
    return ctx.mkIntVar("_".concat(op, "_").concat(indexOfCounter++, ")"));
  }
  var funcCounter = 0;
  function mkFunctionName(fn) {
    return ctx.mkStringSymbol("_fn_".concat(fn, "_").concat(funcCounter++, "_"));
  }
  return {
    mkFunctionName: mkFunctionName,
    mkIndexSymbol: mkIndexSymbol,
    runMethod: runMethod,
    symbolicHook: symbolicHook,
    ConcretizeIfNative: ConcretizeIfNative,
    coerceToString: coerceToString,
    NoOp: NoOp,
    substring: substringHelper
  };
}