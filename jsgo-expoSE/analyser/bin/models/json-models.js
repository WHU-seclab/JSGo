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
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var find = Array.prototype.find;
function _default(state, ctx, model, helpers) {
  function symbolicStringify(field) {
    if (field === undefined) {
      return undefined;
    } else if (field === null) {
      return "null";
    } else if (state.getConcrete(field) instanceof Array) {
      var rstr = '[';
      field = state.getConcrete(field);
      for (var i = 0; i < field.length; i++) {
        if (i > 0) {
          rstr = state.binary('+', rstr, ', ');
        }
        rstr = state.binary('+', rstr, symbolicStringify(field[i]));
      }
      rstr = state.binary('+', rstr, ']');
      return rstr;
    } else if (state.getConcrete(field) instanceof Object) {
      var _rstr = '{';
      var first = true;
      var _iterator = _createForOfIteratorHelper(Object.getOwnPropertyNames(field)),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          var name = state.binary('+', '"', state.binary('+', key, '"'));
          var encodedField = symbolicStringify(field[key]);
          var merged = state.binary('+', name, state.binary('+', ':', encodedField));
          if (!first) {
            _rstr = state.binary('+', _rstr, ',');
          }
          _rstr = state.binary('+', _rstr, merged);
          first = false;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      _rstr = state.binary('+', _rstr, '}');
      return _rstr;
    } else if (typeof state.getConcrete(field) === "string") {
      return state.binary('+', '"', state.binary('+', field, '"'));
    } else {
      return helpers.coerceToString(field);
    }
  }
  model.add(JSON.stringify, function (base, args) {
    var result = symbolicStringify(args[0]);
    return result;
  });
}