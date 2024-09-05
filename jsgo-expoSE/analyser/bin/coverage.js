"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _iidToLocation = _interopRequireDefault(require("./utilities/iidToLocation"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
var LAST_IID = "LAST_IID";

/**
 * Bits for coverage info propagation
 */

var IS_TOUCHED = 0x1;
var CONDITIONAL_TRUE = 0x2;
var CONDITIONAL_FALSE = 0x4;
var Coverage = /*#__PURE__*/function () {
  /**
      * Creates an instance of Coverage.
      * @param {any} sandbox The Jalangi sandbox
      * _branches is an array of coverages for a given sid where the sid is branches[sid+1]
      * @memberOf Coverage
      */
  function Coverage(sandbox) {
    _classCallCheck(this, Coverage);
    this._sandbox = sandbox;
    this._branches = [];
    this._branchFilenameMap = [];
    this._lastIid = 0; //Store the last IID touched for search strategizer

    this.brachTrace = {};
  }
  return _createClass(Coverage, [{
    key: "end",
    value: function end() {
      var payload = {
        code: {}
      };
      for (var i = 0; i < this._branches.length; i++) {
        //SID are indexed from 1 not 0
        var localSid = i + 1;
        if (this._branches[i] !== undefined) {
          //Deep copy the smap
          var map = JSON.parse(JSON.stringify(this._sandbox.smap[localSid]));

          //Strip away any non SID related entities
          for (var localIid in map) {
            if (isNaN(parseInt(localIid))) {
              delete map[localIid];
            } else {
              map[localIid] = (0, _iidToLocation["default"])(this._sandbox, localSid, localIid);
            }
          }
          payload["code"][this._branchFilenameMap[i]] = {
            smap: map,
            branches: this._branches[i]
          };
        }
      }
      payload["path"] = this.brachTrace;
      payload[LAST_IID] = this._lastIid;
      return payload;
    }
  }, {
    key: "getBranchInfo",
    value: function getBranchInfo() {
      //-1 from 1-indexed sid to start from 0
      var localIndex = this._sandbox.sid - 1;
      var branchInfo = this._branches[localIndex];
      if (!branchInfo) {
        branchInfo = {};
        this._branches[localIndex] = branchInfo;
        var map = this._sandbox.smap[this._sandbox.sid];
        this._branchFilenameMap[localIndex] = map ? map.originalCodeFileName : "Broken Filename";
      }
      return branchInfo;
    }
  }, {
    key: "touch",
    value: function touch(iid) {
      this.getBranchInfo()[iid] |= IS_TOUCHED;
      this._lastIid = iid;
    }
  }, {
    key: "touch_cnd",
    value: function touch_cnd(iid, result) {
      this.touch(iid);
      this.getBranchInfo()[iid] |= result ? CONDITIONAL_TRUE : CONDITIONAL_FALSE;
      this.touchBranch(iid, result);
    }
  }, {
    key: "last",
    value: function last() {
      return this._lastIid || 0;
    }
  }, {
    key: "touchBranch",
    value: function touchBranch(iid, result) {
      var binResult = result ? 1 : 0;
      var gid = this._sandbox.sid + ":" + iid;
      if (Object.keys(this.brachTrace).includes(gid)) {
        this.brachTrace[gid].push(binResult);
      } else {
        this.brachTrace[gid] = [binResult];
      }
    }
  }]);
}();
var _default = exports["default"] = Coverage;