"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _readOnlyError(r) { throw new TypeError('"' + r + '" is read-only'); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var SET_TAG = 'set';
var SEEN_TAG = 'seen';
var MAX_TAG = 'max';
var Stats = /*#__PURE__*/function () {
  function Stats() {
    _classCallCheck(this, Stats);
    this.data = {};
  }
  return _createClass(Stats, [{
    key: "_entry",
    value: function _entry(title) {
      //Create a new entry if it doesn't exist
      if (!this.data[title]) {
        this.data[title] = {};
      }
      return this.data[title];
    }
  }, {
    key: "_taggedEntry",
    value: function _taggedEntry(title, tag) {
      var entry = this._entry(title);
      entry.tag = tag;
      return entry;
    }
  }, {
    key: "_getSet",
    value: function _getSet(entry) {
      if (!entry.payload) {
        entry.payload = {};
        delete entry.payload.toString;
      }
      return entry.payload;
    }
  }, {
    key: "set",
    value: function set(title, item) {
      var entry = this._taggedEntry(title, SET_TAG);
      var set = this._getSet(entry);
      item = '#' + item;
      if (set[item]) {
        set[item] += 1;
      } else {
        set[item] = 1;
      }
    }
  }, {
    key: "seen",
    value: function seen(title) {
      var entry = this._taggedEntry(title, SEEN_TAG);
      entry.payload = entry.payload ? entry.payload + 1 : 1;
    }
  }, {
    key: "max",
    value: function max(title, val) {
      var entry = this._taggedEntry(title, MAX_TAG);
      entry.payload = entry.payload ? Math.max(entry.payload, val) : val;
    }
  }, {
    key: "final",
    value: function _final() {
      return this.data;
    }
  }, {
    key: "export",
    value: function _export() {
      return JSON.stringify(this.data);
    }
  }, {
    key: "_mergeSet",
    value: function _mergeSet(data, title) {
      var pl = data[title].payload;
      for (var i in pl) {
        var entry = this._taggedEntry(title, SET_TAG);
        var set = this._getSet(entry);
        if (!set[i]) {
          set[i] = 0;
        }
        set[i] += pl[i];
      }
    }
  }, {
    key: "_mergeSeen",
    value: function _mergeSeen(data, title) {
      //Just add the two payloads together for num stats
      var entry = this._taggedEntry(title, SEEN_TAG);
      if (!entry.payload) {
        entry.payload = 0;
      }
      entry.payload += data[title].payload;
    }
  }, {
    key: "_mergeMax",
    value: function _mergeMax(data, title) {
      var entry = this._taggedEntry(title, MAX_TAG);
      entry.payload = entry.payload || 0;
      entry.payload = Math.max(data[title].payload, entry.payload);
    }
  }, {
    key: "_mergeField",
    value: function _mergeField(data, title) {
      switch (data[title].tag) {
        case SET_TAG:
          this._mergeSet(data, title);
          break;
        case SEEN_TAG:
          this._mergeSeen(data, title);
          break;
        case MAX_TAG:
          this._mergeMax(data, title);
          break;
        default:
          throw 'Bad Merge';
      }
    }
  }, {
    key: "merge",
    value: function merge(data) {
      data = JSON.parse(data);
      for (var entry in data) {
        this._mergeField(data, entry);
      }
    }
  }]);
}();
var _default = exports["default"] = Stats;