"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _wrappedValues = require("../values/wrapped-values");
var _config = _interopRequireDefault(require("../config"));
var _log = _interopRequireDefault(require("../utilities/log"));
var _safeJson = require("../utilities/safe-json");
var _external = _interopRequireDefault(require("../external"));
var _z3javascript = _interopRequireDefault(require("z3javascript"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var isMatchCount = 0;
function _default(state, ctx, model, helpers) {
  var coerceToString = helpers.coerceToString;

  //Hook for regex methods, will only hook if regex is enabled
  function symbolicHookRe(f, condition, hook) {
    var runMethod = helpers.runMethod;
    return function (base, args) {
      if (_config["default"].regexEnabled && condition(base, args)) {
        state.savePrototype();
        var ret = hook(base, args);
        state.restorePrototype();
        return ret;
      } else {
        var _runMethod = runMethod(f, base, args),
          _runMethod2 = _slicedToArray(_runMethod, 2),
          result = _runMethod2[0],
          thrown = _runMethod2[1];
        if (thrown) {
          throw thrown;
        }
        return result;
      }
    };
  }
  function DoesntMatch(l, r) {
    if (l == undefined) {
      var is_match = r == "" || r == undefined;
      return !is_match;
    } else {
      return l !== r;
    }
  }
  function Exists(array1, array2, pred) {
    for (var i = 0; i < array1.length; i++) {
      if (pred(array1[i], array2[i])) {
        return true;
      }
    }
    return false;
  }
  function EnableCaptures(regex, real, string_s) {
    if (!_config["default"].capturesEnabled) {
      _log["default"].log("Captures disabled - potential loss of precision");
    }
    var implies = ctx.mkImplies(ctx.mkSeqInRe(string_s, regex.ast), ctx.mkEq(string_s, regex.implier));

    //Mock the symbolic conditional if (regex.test(/.../) then regex.match => true)
    regex.assertions.forEach(function (binder) {
      return state.pushCondition(binder, true);
    });
    state.pushCondition(implies, true);
  }
  function BuildRefinements(regex, real, string_s, is_match_s) {
    //The refinements operate on the remainder of the string so we no longer care about the sticky / global rules
    real = new RegExp(real.source, real.flags.replace(/y|g/g, ""));
    if (!(_config["default"].capturesEnabled && _config["default"].refinementsEnabled)) {
      _log["default"].log("Refinements disabled - potential accuracy loss");
      return [];
    }
    _log["default"].log("Refinements Enabled - Adding checks");
    state.stats.seen("Regex Which May Need Checks");

    //TODO: This is a workaround as calling asConstant on is_match_s doesn't work
    //Remove when we get a reply from the Z3 guys
    var isMatch = ctx.mkBoolVar('IsMatch_' + real + '_' + isMatchCount++);
    state.pushCondition(ctx.mkEq(is_match_s, isMatch), true);
    function CheckCorrect(model) {
      if (model.eval(isMatch).asConstant(model)) {
        //Only apply this check if str.in.re .... was meant to be true

        state.stats.seen("Regex Checks");
        var real_match = real.exec(model.eval(string_s).asConstant(model));
        var sym_match = regex.captures.map(function (cap) {
          return model.eval(cap).asConstant(model);
        });
        var is_correct = real_match && !Exists(real_match, sym_match, DoesntMatch);
        if (!is_correct) {
          state.stats.seen("Failed Regex Checks");
        }
        return is_correct;
      } else {
        return true;
      }
    }
    function CheckFailed(model) {
      if (!model.eval(isMatch).asConstant(model)) {
        state.stats.seen("Regex Checks");
        var is_failed = !real.test(model.eval(string_s).asConstant(model));
        if (!is_failed) {
          state.stats.seen("Failed Regex Checks");
        }
        return is_failed;
      } else {
        return true;
      }
    }
    var NotMatch = _z3javascript["default"].Check(CheckCorrect, function (query, model) {
      var not = ctx.mkNot(ctx.mkEq(string_s, ctx.mkString(model.eval(string_s).asConstant(model))));
      return [new _z3javascript["default"].Query(query.exprs.slice(0).concat([not]), [CheckFixed, NotMatch])];
    });

    /**
     * Generate a fixed string refinement (c_0, c_n, ...) == (e_0, e_n, ...)
     */
    var CheckFixed = _z3javascript["default"].Check(CheckCorrect, function (query, model) {
      var real_match = real.exec(model.eval(string_s).asConstant(model));
      if (!real_match) {
        _log["default"].log("WARN: Broken regex detected ".concat(regex.ast.toString(), " vs ").concat(real, " in ").concat(model.eval(string_s).asConstant(model)));
        return [];
      }
      real_match = real_match.map(function (match) {
        return match || "";
      });
      var query_list = regex.captures.map(function (cap, idx) {
        return ctx.mkEq(ctx.mkString(real_match[idx]), cap);
      });
      return [new _z3javascript["default"].Query(query.exprs.slice(0).concat(query_list), [])];
    });
    var CheckNotIn = _z3javascript["default"].Check(CheckFailed, function (query, model) {
      var not = ctx.mkNot(ctx.mkEq(string_s, ctx.mkString(model.eval(string_s).asConstant(model))));
      return [new _z3javascript["default"].Query(query.exprs.slice(0).concat([not]), [CheckNotIn])];
    });
    return [CheckFixed, NotMatch, CheckNotIn];
  }

  /** As an optimization we implement test differently, this allows us to not generated extra paths when not needed on usage **/
  function RegexpBuiltinTest(regex, string) {
    var currentLastIndex = regex.lastIndex;
    regex.lastIndex = state.getConcrete(regex.lastIndex);
    var is_match_c = regex.test(state.getConcrete(string));
    if (regex.sticky || regex.global) {
      //Cut at regex.lastIndex
      state.stats.seen('Sticky (RegexBuiltinExec)');
      string = model.get(String.prototype.substring).call(string, currentLastIndex);
      if (!regex.source[0] != '^') {
        _log["default"].log("In Sticky Mode We Insert ^");
        regex = new RegExp('^' + regex.source, regex.flags);
      }
    }
    state.stats.seen('Regex Encoded');
    var regexEncoded = _z3javascript["default"].Regex(ctx, regex);
    var is_match_s = ctx.mkSeqInRe(state.asSymbolic(string), regexEncoded.ast);
    console.log("|REGEX ENCODING| ".concat(regex, ".exec(").concat(state.asSymbolic(string).toString(), ") -> (").concat(regexEncoded.anchoredStart ? regexEncoded.anchoredStart.toString() : '', ", ").concat(regexEncoded.anchoredEnd ? regexEncoded.anchoredEnd.toString() : '', ") (").concat(regexEncoded.captures.reduce(function (last, capture, idx) {
      return last + (idx > 0 ? ',' : '') + capture.toString();
    }, ''), ")"));
    EnableCaptures(regexEncoded, regex, state.asSymbolic(string));
    is_match_s.checks = BuildRefinements(regexEncoded, regex, state.asSymbolic(string), is_match_s);
    if (_config["default"].capturesEnabled && (regex.sticky || regex.global)) {
      _log["default"].log('Captures enabled - symbolic lastIndex enabled');
      regexEncoded.startIndex = ctx.mkAdd(state.asSymbolic(currentLastIndex), regexEncoded.startIndex);
      regex.lastIndex = new _wrappedValues.ConcolicValue(regex.lastIndex, ctx.mkIte(is_match_s, ctx.mkAdd(state.asSymbolic(currentLastIndex), regexEncoded.captures[0].getLength()), ctx.mkIntVal(0)));
    }
    return {
      result: new _wrappedValues.ConcolicValue(is_match_c, is_match_s),
      encodedRegex: regexEncoded
    };
  }
  function RegexpBuiltinExec(regex, string) {
    //Preserve the lastIndex property
    var lastIndex = regex.lastIndex;
    var test = RegexpBuiltinTest(regex, string);
    regex.lastIndex = lastIndex;
    state.conditional(test.result); //Fork on the str.in.re operation

    var result_c = regex.exec(state.getConcrete(string));
    if (_config["default"].capturesEnabled && result_c) {
      //If str.in.re is success & captures are enabled then rewrite the capture results

      var nr = [];
      for (var i = 0; i < result_c.length; i++) {
        //TODO: Alias type symbolically for strings String = Undefined | String THIS IS BAD
        nr.push(new _wrappedValues.ConcolicValue(result_c[i] === undefined ? "" : result_c[i], test.encodedRegex.captures[i]));
      }

      //Start Index can only be computed when we have captures enabled
      nr.index = new _wrappedValues.ConcolicValue(result_c.index, test.encodedRegex.startIndex);
      nr.input = string;
      result_c = nr;
    }
    return {
      result: result_c,
      encodedRegex: test.encodedRegex
    };
  }
  function RegexpBuiltinMatch(regex, string) {
    if (regex.global) {
      //Remove g and y from regex
      var rewrittenRe = new RegExp(regex.source, regex.flags.replace(/g|y/g, "") + "y");
      var results = [];
      while (true) {
        var next = RegexpBuiltinExec(rewrittenRe, string);
        if (!next.result) {
          break;
        }
        results.push(next.result[0]);
      }
      return {
        result: results
      };
    } else {
      //Remove g and y from regex
      var _rewrittenRe = new RegExp(regex.source, regex.flags.replace(/"g|y"/g, ""));
      return RegexpBuiltinExec(_rewrittenRe, string);
    }
  }
  function RegexpBuiltinSearch(regex, string) {
    var rewrittenRe = new RegExp(regex.source, regex.flags.replace(/g|y/g, ""));
    var test = RegexpBuiltinTest(rewrittenRe, string);
    var search_in_re = ctx.mkIte(state.asSymbolic(test.result), test.encodedRegex.startIndex, state.constantSymbol(-1));
    return {
      result: new _wrappedValues.ConcolicValue(state.getConcrete(string).search(regex), search_in_re)
    };
  }
  function RegexpBuiltinSplit(regex, string) {
    //Remove g and y from regex
    var re = new RegExp(regex.source, regex.flags.replace(/g|y/g, "") + "");
    var results = [];
    var lastIndex = 0;
    function rest() {
      return model.get(String.prototype.substring).call(string, lastIndex);
    }

    //While there is still a match of regex in string add the area before it to results and
    //then increase lastIndex by the size of the match + its start index
    while (true) {
      //Grab the remaining portion of the string and call exec on it
      var next = RegexpBuiltinExec(re, rest()).result;

      //While matches remain extract the bit before the match, add that to the result, update lastIndex and step
      if (next) {
        var matchSize = new _wrappedValues.ConcolicValue(state.getConcrete(next[0]).length, state.asSymbolic(next[0]).getLength());
        var wordsBeforeSplit = model.get(String.prototype.substring).call(string, lastIndex, next.index);
        results.push(wordsBeforeSplit);
        lastIndex = state.binary('+', lastIndex, state.binary('+', next.index, matchSize));
      } else {
        break;
      }
    }

    //After we have exhausted all instances of the re in string push the remainder to the result
    results.push(rest());
    return {
      result: results
    };
  }
  function RegexpBuiltinReplace(regex, string, replacementString) {
    //Remove g and y from regex
    var rewrittenRe = new RegExp(regex.source, regex.flags.replace(/g/g, "") + "");
    if (regex.flags.includes('g')) {
      var replaced = true;

      //Global replace
      while (true) {
        var next = RegexpBuiltinReplace(rewrittenRe, string, replacementString);
        if (!next.replaced) {
          break;
        }
        replaced = true;
        string = next.result;
      }
      return {
        result: string,
        replaced: replaced
      };
    } else {
      //Single point replace
      var _next = RegexpBuiltinExec(rewrittenRe, string).result;
      if (_next) {
        //Find out the match size
        var matchSize = new _wrappedValues.ConcolicValue(state.getConcrete(_next[0]).length, state.asSymbolic(_next[0]).getLength());

        //Collect the parts before and after the match
        var lhs = model.get(String.prototype.substring).call(string, 0, _next.index);
        var rhs = model.get(String.prototype.substring).call(string, state.binary('+', _next.index, matchSize));
        if (typeof state.getConcrete(replacementString) === "function") {
          string = state.binary('+', lhs, state.binary('+', coerceToString(replacementString.apply(null, _next)), rhs));
        } else {
          var finalString;

          //Simple (NOT STANDARDS-COMPLAINT!!) substitution for replacement strings with things like $1, $2 in them
          if (state.getConcrete(replacementString).search(/\$[0-9]/) != -1) {
            _log["default"].log('WARN: no support for symbolic replacement strings');
            var remaining = state.getConcrete(replacementString);
            finalString = "";
            var toreplace;
            while (toreplace = /\$[0-9]/.exec(remaining)) {
              var before = remaining.substr(0, toreplace.index);
              var _replaced = _next[toreplace[0][1]];
              finalString = state.binary('+', finalString, state.binary('+', before, _replaced));
              remaining = remaining.substr(toreplace.index + toreplace[0].length);
            }
            finalString = state.binary('+', finalString, remaining);
          } else {
            //Short circuit if there are no substitution strings
            finalString = replacementString;
          }
          string = state.binary('+', lhs, state.binary('+', finalString, rhs));
        }
        return {
          result: string,
          replaced: true
        };
      } else {
        return {
          result: string,
          replaced: false
        };
      }
    }
  }
  function shouldBeSymbolic(regex, string) {
    return regex instanceof RegExp && (state.isSymbolic(regex.lastIndex) || state.isSymbolic(string));
  }
  model.add(String.prototype.search, symbolicHookRe(String.prototype.search, function (base, args) {
    return shouldBeSymbolic(args[0], base);
  }, function (base, args) {
    return RegexpBuiltinSearch(args[0], coerceToString(base)).result;
  }));
  model.add(String.prototype.match, symbolicHookRe(String.prototype.match, function (base, args) {
    return shouldBeSymbolic(args[0], base);
  }, function (base, args) {
    return RegexpBuiltinMatch(args[0], coerceToString(base)).result;
  }));
  model.add(RegExp.prototype.exec, symbolicHookRe(RegExp.prototype.exec, function (base, args) {
    return shouldBeSymbolic(base, args[0]);
  }, function (base, args) {
    return RegexpBuiltinExec(base, coerceToString(args[0])).result;
  }));
  model.add(RegExp.prototype.test, symbolicHookRe(RegExp.prototype.test, function (base, args) {
    return shouldBeSymbolic(base, args[0]);
  }, function (base, args) {
    return RegexpBuiltinTest(base, coerceToString(args[0])).result;
  }));
  model.add(String.prototype.replace, symbolicHookRe(String.prototype.replace, function (base, args) {
    return shouldBeSymbolic(args[0], base) && (typeof state.getConcrete(args[1]) === "string" || typeof state.getConcrete(args[1]) === "function");
  }, function (base, args) {
    return RegexpBuiltinReplace(args[0], base, args[1]).result;
  }));
  model.add(String.prototype.split, symbolicHookRe(String.prototype.split, function (base, args) {
    return state.isSymbolic(base) && (args[0] instanceof RegExp || typeof args[0] === "string");
  }, function (base, args) {
    return RegexpBuiltinSplit(args[0] instanceof RegExp ? args[0] : new RegExp(args[0]), base).result;
  }));

  /**
   * Occasionally (Thanks James....) it appears developers may resolve the Symbol for the match method rather than use the API. Most interpreters use the same instance of the method for all constructs so we can add a model by creating a new RegExp, extracting the default match symbol and adding that to the models.
   */

  var Template = /DEFAULT/;
  model.add(Template[Symbol.search], symbolicHookRe(Template[Symbol.search], function (base, args) {
    return shouldBeSymbolic(base, args[0]);
  }, function (base, args) {
    return RegexpBuiltinSearch(base, coerceToString(args[0])).result;
  }));
  model.add(Template[Symbol.exec], symbolicHookRe(Template[Symbol.exec], function (base, args) {
    return shouldBeSymbolic(base, args[0]);
  }, function (base, args) {
    return RegexpBuiltinExec(base, coerceToString(args[0])).result;
  }));
  model.add(Template[Symbol.match], symbolicHookRe(Template[Symbol.match], function (base, args) {
    return shouldBeSymbolic(base, args[0]);
  }, function (base, args) {
    return RegexpBuiltinExec(base, coerceToString(args[0])).result;
  }));
  model.add(Template[Symbol.replace], symbolicHookRe(Template[Symbol.replace], function (base, args) {
    return shouldBeSymbolic(base, args[0]) && (typeof state.getConcrete(args[1]) === "string" || typeof state.getConcrete(args[1]) === "function");
  }, function (base, args) {
    return RegexpBuiltinReplace(base, args[0], args[1]).result;
  }));
}