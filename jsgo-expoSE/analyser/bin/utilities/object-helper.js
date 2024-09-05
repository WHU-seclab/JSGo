"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var MAX_LOG_DEPTH = 2;
var ObjectHelper = /*#__PURE__*/_createClass(function ObjectHelper() {
  _classCallCheck(this, ObjectHelper);
});
ObjectHelper.functionName = function (fn) {
  return fn.name || "anonymous";
};
ObjectHelper.safe = function (item) {
  item.__safe_item_to_string = true;
};
ObjectHelper.isSafe = function (item) {
  return item && item.__safe_item_to_string;
};
ObjectHelper.startsWith = function (str1, searchString) {
  return str1.substr(0, searchString.length) === searchString;
};
ObjectHelper.repeat = function (str, count) {
  var repeatedStr = "";
  while (count > 0) {
    repeatedStr += str;
    count--;
  }
  return repeatedStr;
};
ObjectHelper.enumerate = function (item, depth) {
  if (depth < MAX_LOG_DEPTH) {
    if (item instanceof Array) {
      return "[" + item.reduce(function (last, next) {
        return last + (last.length == 0 ? "" : ", ") + ObjectHelper.asString(next, false, depth + 1);
      }, "") + "]";
    } else if (item instanceof Object) {
      var result = "{";
      var first = true;
      for (var property in item) {
        result += (first ? "" : ",") + "\n" + ObjectHelper.repeat("    ", depth + 1) + property + ": " + ObjectHelper.asString(item[property], false, depth + 1);
        first = false;
      }
      result += "\n}";
      return result;
    }
  } else {
    return "Max Depth";
  }
  return "Unstringable";
};
ObjectHelper.asString = function (item, forceSafe, depth) {
  //If depth is undefined make it 0
  depth = depth || 0;
  if (item instanceof Function) {
    return ObjectHelper.functionName(item);
  }
  if (typeof item === "number" || typeof item === "boolean" || typeof item === "string" || item === undefined || item === null) {
    return "" + item;
  }
  if (forceSafe || ObjectHelper.isSafe(item)) {
    return item.toString();
  } else if (item instanceof Symbol) {
    return "Unstringable";
  } else {
    return ObjectHelper.enumerate(item, depth);
  }
};
var _default = exports["default"] = ObjectHelper;