"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
var Strategy = /*#__PURE__*/function () {
  function Strategy() {
    _classCallCheck(this, Strategy);
    //Buckets can be sorted by fork point or randomly selected to change search strategy
    this._buckets = [];

    //Cache the length of the total remaining so we don't have to loop to identify len
    this._totalQueued = 0;
    this._totalEaten = 0;
  }
  return _createClass(Strategy, [{
    key: "_findOrCreate",
    value: function _findOrCreate(id) {
      var found = this._buckets.find(function (x) {
        return x.id == id;
      });
      if (!found) {
        found = {
          id: id,
          entries: [],
          seen: 0
        };
        this._buckets.push(found);
      }
      return found;
    }
  }, {
    key: "add",
    value: function add(target, sourceInfo) {
      // Manually added paths and some edge-cases don't have a forkIid, just make one up
      var bucketId = sourceInfo ? sourceInfo.forkIid : 0;
      var bucket = this._findOrCreate(bucketId);
      bucket.entries.push(target);

      //Update total queued list
      this._totalQueued++;
    }
  }, {
    key: "_selectFromBucket",
    value: function _selectFromBucket(bucket) {
      return bucket.entries.shift();
    }
  }, {
    key: "_selectLeastSeen",
    value: function _selectLeastSeen() {
      //Sort buckets by seen, find the first non empty bucket and then use the entry
      this._buckets.sort(function (x, y) {
        return x.seen - y.seen;
      });
      var firstNonEmptyBucket = this._buckets.find(function (x) {
        return x.entries.length;
      });
      firstNonEmptyBucket.seen++;
      return this._selectFromBucket(firstNonEmptyBucket);
    }
  }, {
    key: "_selectRandomEntry",
    value: function _selectRandomEntry() {
      var nonEmptyBuckets = this._buckets.filter(function (x) {
        return x.entries.length;
      });
      var selectedBucket = nonEmptyBuckets[Math.floor(Math.random() * nonEmptyBuckets.length)];
      return this._selectFromBucket(selectedBucket);
    }
  }, {
    key: "next",
    value: function next() {
      this._totalQueued--;
      return this._selectLeastSeen();
    }
  }, {
    key: "length",
    value: function length() {
      return this._totalQueued;
    }
  }]);
}();
var _default = exports["default"] = Strategy;