"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _wrappedValues = require("../values/wrapped-values");
var _log = _interopRequireDefault(require("../utilities/log"));
var _external = _interopRequireDefault(require("../external"));
var _z3javascript = _interopRequireDefault(require("z3javascript"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var find = Array.prototype.find;
function _default(state, ctx, model, helpers) {
  var mkIndexSymbol = helpers.mkIndexSymbol;
  var symbolicHook = helpers.symbolicHook;
  var symbolicSubstring = helpers.substring;
  var coerceToString = helpers.coerceToString;
  var mkFunctionName = helpers.mkFunctionName;

  /**
   * Stubs string constructor with our (flaky) coerceToString fn
   */
  model.add(String, symbolicHook(String, function (_base, args) {
    return state.isSymbolic(args[0]);
  }, function (_base, args, _result) {
    return coerceToString(args[0]);
  }));
  var substrModel = symbolicHook(String.prototype.substr, function (base, args) {
    return typeof state.getConcrete(base) === "string" && (state.isSymbolic(base) || state.isSymbolic(args[0]) || state.isSymbolic(args[1]));
  }, symbolicSubstring);
  model.add(String.prototype.includes, symbolicHook(String.prototype.includes, function (base, args) {
    return typeof state.getConcrete(base) === "string" && state.isSymbolic(base) || state.isSymbolic(args[0]);
  }, function (base, args, result) {
    //Theory:
    //base = string, args[0] coerced to string if not string
    //If there exists some i such that substr(base, i, length args[0]) == args[0] then true
    //Otherwise false

    args[0] = coerceToString(args[0]);
    var startPosition = mkIndexSymbol('Includes_Start');
    var substringPart = ctx.mkSeqSubstr(state.asSymbolic(base), startPosition, state.asSymbolic(args[0]).getLength());
    return new _wrappedValues.ConcolicValue(result, ctx.mkEq(substringPart, state.asSymbolic(args[0])));
  }));
  model.add(String.prototype.substr, substrModel);
  model.add(String.prototype.substring, substrModel);
  model.add(String.prototype.slice, symbolicHook(String.prototype.slice, function (base, args) {
    return typeof state.getConcrete(base) === "string" && (state.isSymbolic(base) || state.isSymbolic(args[0]) || state.isSymbolic(args[1]));
  }, function (base, args, result) {
    function relativeIndex(i) {
      return new _wrappedValues.ConcolicValue(state.getConcrete(i) < 0 ? state.getConcrete(base).length - state.getConcrete(i) : state.getConcrete(i), ctx.mkIte(ctx.mkLt(state.asSymbolic(i), ctx.mkIntVal(0)), ctx.mkSub(state.asSymbolic(base).getLength(), ctx.mkMul(state.asSymbolic(i), ctx.mkIntVal(-1))), state.asSymbolic(i)));
    }
    var from = relativeIndex(args[0]);
    var to;
    if (args[1]) {
      to = relativeIndex(args[1]);
    } else {
      to = new _wrappedValues.ConcolicValue(state.getConcrete(base).length, state.asSymbolic(base).getLength());
    }
    var startIndex = ctx.mkRealToInt(state.asSymbolic(from));
    var length = ctx.mkRealToInt(state.asSymbolic(state.binary('-', to, from)));
    return new _wrappedValues.ConcolicValue(result, ctx.mkSeqSubstr(state.asSymbolic(base), startIndex, length));
  }));
  model.add(String.prototype.charAt, symbolicHook(String.prototype.charAt, function (base, args) {
    var is_symbolic = state.isSymbolic(base) || state.isSymbolic(args[0]);
    var is_well_formed = typeof state.getConcrete(base) === "string" && typeof state.getConcrete(args[0]) === "number";
    return is_symbolic && is_well_formed;
  }, function (base, args, result) {
    var index_s = ctx.mkRealToInt(state.asSymbolic(args[0]));
    var char_s = ctx.mkSeqAt(state.asSymbolic(base), index_s);
    return new _wrappedValues.ConcolicValue(result, char_s);
  }));
  model.add(String.prototype.concat, symbolicHook(String.prototype.concat, function (base, args) {
    return state.isSymbolic(base) || find.call(args, function (arg) {
      return state.isSymbolic(arg);
    });
  }, function (base, args, result) {
    var arg_s_list = Array.prototype.map.call(args, function (arg) {
      return state.asSymbolic(arg);
    });
    var concat_s = ctx.mkSeqConcat([state.asSymbolic(base)].concat(arg_s_list));
    return new _wrappedValues.ConcolicValue(result, concat_s);
  }));
  model.add(String.prototype.indexOf, symbolicHook(String.prototype.indexOf, function (base, args) {
    return typeof state.getConcrete(base) === "string" && (state.isSymbolic(base) || state.isSymbolic(args[0]) || state.isSymbolic(args[1]));
  }, function (base, args, result) {
    var off_real = args[1] ? state.asSymbolic(args[1]) : state.asSymbolic(0);
    var off_s = ctx.mkRealToInt(off_real);
    var target_s = state.asSymbolic(coerceToString(args[0]));
    var seq_index = ctx.mkSeqIndexOf(state.asSymbolic(base), target_s, off_s);
    return new _wrappedValues.ConcolicValue(result, seq_index);
  }));

  //TODO: Fix LastIndexOf models
  model.add(String.prototype.lastIndexOf, symbolicHook(String.prototype.lastIndexOf, function (base, args) {
    return typeof state.getConcrete(base) === "string" && (state.isSymbolic(base) || state.isSymbolic(args[0]) || state.isSymbolic(args[1]));
  }, function (base, args, result) {
    var off_real = args[1] ? state.asSymbolic(args[1]) : state.asSymbolic(0);
    var off_s = ctx.mkRealToInt(off_real);
    var target_s = state.asSymbolic(coerceToString(args[0]));
    var seq_index = ctx.mkSeqIndexOf(state.asSymbolic(base), target_s, off_s);
    return new _wrappedValues.ConcolicValue(result, seq_index);
  }));

  /*
  model.add(String.prototype.lastIndexOf, symbolicHook(
  String.prototype.lastIndexOf,
  (base, args) => typeof state.getConcrete(base) === "string" && (state.isSymbolic(base) || state.isSymbolic(args[0]) || state.isSymbolic(args[1])),
  (base, args, result) => {
       //Theory: Similar to indexOf
      //n = indexOf s p q where q == args[1] || length(base)
      //n != -1 => Not (Exists n < i < length s s.t. indexOf s t  == i)
  	  const off_real = args[1] ? state.asSymbolic(args[1]) : state.asSymbolic(base).getLength();
    const off_s = ctx.mkRealToInt(off_real);
      const actualIndex = mkIndexSymbol('LastIndexOf_Start_Position');
  	  const target_s = state.asSymbolic(coerceToString(args[0]));
    const seq_index = ctx.mkSeqIndexOf(state.asSymbolic(base), target_s, actualIndex);
        Log.log('WARN: lastIndexOf LOSS OF PRECISION does not guarentee last index');
       //Test for if there are later matches
      const intSort = ctx.mkIntSort();
      const i = ctx.mkBound(0, intSort);
      const notMatch = ctx.mkEq(ctx.mkSeqIndexOf(state.asSymbolic(base), target_s, i), ctx.mkIntVal(-1));
       const bounds = ctx.mkPattern([
          ctx.mkLt(i, state.asSymbolic(base).getLength()),
          ctx.mkGt(i, seq_index)
      ]);
  	  const noLaterMatches = ctx.mkForAll([mkFunctionName("lastIndexOf")], intSort, notMatch, [bounds]);
      state.pushCondition(noLaterMatches, true);
  	  return new ConcolicValue(result, seq_index);
  }));
  */
  model.add(String.prototype.repeat, symbolicHook(String.prototype.repeat, function (base, a) {
    return state.isSymbolic(base) || state.isSymbolic(a[0]) && typeof state.getConcrete(base) == "string" && typeof state.getConcrete(a[0]) == "number";
  }, function (base, a, result) {
    var num_repeats = state.asSymbolic(a[0]);
    state.pushCondition(ctx.mkGe(num_repeats, ctx.mkIntVal(0)));
    var result_s = ctx.mkApp(state.stringRepeat, [state.asSymbolic(base), ctx.mkRealToInt(num_repeats)]);
    return new _wrappedValues.ConcolicValue(result, result_s);
  }));
  function trimLeftSymbolic(base_s) {
    var whiteLeft = ctx.mkApp(state.whiteLeft, [base_s, ctx.mkIntVal(0)]);
    var strLen = base_s.getLength();
    var totalLength = ctx.mkSub(strLen, whiteLeft);
    return ctx.mkSeqSubstr(base_s, whiteLeft, totalLength);
  }
  function trimRightSymbolic(base_s) {
    var strLen = base_s.getLength();
    var whiteRight = ctx.mkApp(state.whiteRight, [base_s, strLen]);
    var totalLength = ctx.mkAdd(whiteRight, ctx.mkIntVal(1));
    return ctx.mkSeqSubstr(base_s, ctx.mkIntVal(0), totalLength);
  }
  model.add(String.prototype.trimRight, symbolicHook(String.prototype.trim, function (base, _a) {
    return state.isSymbolic(base) && typeof state.getConcrete(base).valueOf() === "string";
  }, function (base, _a, result) {
    var base_s = state.asSymbolic(base);
    return new _wrappedValues.ConcolicValue(result, trimRightSymbolic(base_s));
  }));
  model.add(String.prototype.trimLeft, symbolicHook(String.prototype.trim, function (base, _a) {
    return state.isSymbolic(base) && typeof state.getConcrete(base).valueOf() === "string";
  }, function (base, _a, result) {
    var base_s = state.asSymbolic(base);
    return new _wrappedValues.ConcolicValue(result, trimLeftSymbolic(base_s));
  }));
  model.add(String.prototype.trim, symbolicHook(String.prototype.trim, function (base, _a) {
    return state.isSymbolic(base) && typeof state.getConcrete(base).valueOf() === "string";
  }, function (base, _a, result) {
    var base_s = state.asSymbolic(base);
    return new _wrappedValues.ConcolicValue(result, trimRightSymbolic(trimLeftSymbolic(base_s)));
  }));
  model.add(String.prototype.toLowerCase, symbolicHook(String.prototype.toLowerCase, function (base, _a) {
    return state.isSymbolic(base) && typeof state.getConcrete(base).valueOf() === "string";
  }, function (base, _a, result) {
    base = coerceToString(base);
    state.pushCondition(ctx.mkSeqInRe(state.asSymbolic(base), _z3javascript["default"].Regex(ctx, /^[^A-Z]+$/).ast), true);
    return new _wrappedValues.ConcolicValue(result, state.asSymbolic(base));
  }));
  // jackfromeast
  model.add(String.prototype.toString, symbolicHook(String.prototype.toString, function (base, _args) {
    return state.isSymbolic(base) && typeof state.getConcrete(base) === 'string';
  }, function (base, _args, result) {
    // No transformation is needed because the base value is already a string
    return new _wrappedValues.ConcolicValue(result, state.asSymbolic(base));
  }));
}