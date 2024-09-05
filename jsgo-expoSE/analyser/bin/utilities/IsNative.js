"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNative = isNative;
var _log = _interopRequireDefault(require("./log"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); } /* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
/** 
 * Some code is from https://gist.github.com/jdalton/5e34d890105aca44399f by John-David Dalton
 */

var toString = Object.prototype.toString;
var fnToString = Function.prototype.toString;
var reHostCtor = /^\[object .+?Constructor\]$/;
var SECRET_CACHE_STR = "__checked_isNative__before__";
var reNative = RegExp("^" + String(toString).replace(/[.*+?^${}()|[\]\/\\]/g, "\\$&").replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
function isNativeCore(value) {
  if (value.hasOwnProperty('toString')) {
    _log["default"].log('WARNING: IsNative will not work on custom toString methods. We assume nobody would overwrite core method toStrings');
    return false;
  }
  if (typeof value === "function") {
    return reNative.test(fnToString.call(value));
  } else if (_typeof(value) === "object") {
    return reHostCtor.test(toString.call(value));
  } else {
    return false;
  }
}
function isNative(v) {
  var type = _typeof(v);
  if (v === null || v === undefined) {
    return false;
  }
  if (typeof v === "function" || _typeof(v) === "object") {
    return isNativeCore(v);
  } else {
    return false;
  }
}