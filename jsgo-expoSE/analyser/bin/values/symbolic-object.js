"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SymbolicObject = void 0;
var _log = _interopRequireDefault(require("../utilities/log"));
var _wrappedValues = require("./wrapped-values");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
var SymbolicObject = exports.SymbolicObject = /*#__PURE__*/function (_WrappedValue) {
  function SymbolicObject(name) {
    var _this;
    _classCallCheck(this, SymbolicObject);
    _this = _callSuper(this, SymbolicObject, [{}]);
    _this.__defineProperty("_name", name);
    _this.__defineProperty("_core", _this.getConcrete());
    _this.__defineProperty("_set", {});
    _this.__defineProperty("_lastIndex", 0);
    return _this;
  }
  _inherits(SymbolicObject, _WrappedValue);
  return _createClass(SymbolicObject, [{
    key: "__defineProperty",
    value: function __defineProperty(name, value) {
      Object.defineProperty(this, name, {
        value: value,
        enumerable: false,
        writable: true,
        configurable: true
      });
    }
  }, {
    key: "setField",
    value: function setField(state, offset, v) {
      state.stats.seen("Symbolic Object Field Overrides");
      this._core[offset] = v;
      this._set[offset] = true;
    }
  }, {
    key: "getField",
    value: function getField(state, offset) {
      state.stats.seen("Symbolic Object Field Lookups");

      /**
       * lazy initialization of symbolic object fields except:
       * 1/ FIXME: reading object's built-in methods
       * 2/ the field is meant to be undefined(the field will be set as in the this._set[offset] = true;)
       */
      if (!this._set[offset]) {
        // Can't use offset in name, if offset is a symbol is will crash
        // console.log("Creating pure symbol for offset " + offset);
        // this._core[offset] = state.createPureSymbol(`${this._name}_elements_${offset}_${this._lastIndex++}`);
        this.setField(state, offset, state.createPureSymbol("".concat(this._name, "_elements_").concat(offset)));
      }
      return this._core[offset];
    }
  }, {
    key: "delete",
    value: function _delete(offset) {
      this._set[offset] = false;
      delete this._core[offset];
    }
  }]);
}(_wrappedValues.WrappedValue);