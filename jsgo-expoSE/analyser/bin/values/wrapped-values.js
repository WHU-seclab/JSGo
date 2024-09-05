"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WrappedValue = exports.ConcolicValue = void 0;
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
/*
 * Original Concolic Value License
 *
 * Copyright 2013 Samsung Information Systems America, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// ES6 Translation / Blake Loring
/**
 * 
 */
var WrappedValue = exports.WrappedValue = /*#__PURE__*/function () {
  function WrappedValue(concrete) {
    _classCallCheck(this, WrappedValue);
    // this.concrete = concrete;
    // jackfromeast, make it cannot be enumerated
    Object.defineProperty(this, 'concrete', {
      value: concrete,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
  return _createClass(WrappedValue, [{
    key: "clone",
    value: function clone() {
      return new WrappedValue(this.concrete);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Wrapped(" + this.concrete + ", " + (this.rider ? this.rider.toString() : "") + ")";
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      return this.concrete ? this.concrete.valueOf() : this.concrete;
    }
  }, {
    key: "getConcrete",
    value: function getConcrete() {
      return this.concrete;
    }
  }]);
}();
var ConcolicValue = exports.ConcolicValue = /*#__PURE__*/function (_WrappedValue) {
  /**
   * TODO: I'm not sure I like passing array type with concolic values to sanity check comparisons
   */
  function ConcolicValue(concrete, symbolic) {
    var _this;
    var arrayType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    _classCallCheck(this, ConcolicValue);
    _this = _callSuper(this, ConcolicValue, [concrete]);
    // this.symbolic = symbolic;
    // this._arrayType = arrayType;

    // jackfromeast, make it cannot be enumerated
    _this.__defineProperty('symbolic', symbolic);
    _this.__defineProperty('_arrayType', arrayType);
    return _this;
  }
  _inherits(ConcolicValue, _WrappedValue);
  return _createClass(ConcolicValue, [{
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
    key: "toString",
    value: function toString() {
      return "Concolic(" + this.concrete + ", " + this.symbolic + ")";
    }
  }, {
    key: "clone",
    value: function clone() {
      return new ConcolicValue(this.concrete, this.symbolic);
    }
  }, {
    key: "getConcrete",
    value: function getConcrete() {
      return this.concrete;
    }
  }, {
    key: "getSymbolic",
    value: function getSymbolic() {
      return this.symbolic;
    }
  }, {
    key: "getArrayType",
    value: function getArrayType() {
      return this._arrayType;
    }
  }]);
}(WrappedValue);
ConcolicValue.getSymbolic = function (val) {
  return val instanceof ConcolicValue ? val.symbolic : undefined;
};
ConcolicValue.setSymbolic = function (val, val_s) {
  if (val instanceof ConcolicValue) {
    val.symbolic = val_s;
  }
};