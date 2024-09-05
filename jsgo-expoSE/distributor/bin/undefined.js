"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * undefinedPool is used to
 * 1/ store overall undefined props as a pool of the test file
 * 2/ store newly discovered undefined props of each test case
 */

var fs = require("fs");
var UndefinedPool = /*#__PURE__*/function () {
  function UndefinedPool() {
    var initalFile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    _classCallCheck(this, UndefinedPool);
    this.undefinedPool = [];
    this.updatedMap = {};
    // for each test case, store newly discovered undefined props
    this.currentUpdataedMap = {};
    if (initalFile) {
      try {
        var data = fs.readFileSync(initalFile, {
          encoding: "utf8"
        });
        this.undefinedPool = Object.keys(JSON.parse(data));
      } catch (err) {
        console.log(err);
      }
    }
  }
  return _createClass(UndefinedPool, [{
    key: "updatePool",
    value: function updatePool(input, pool) {
      var _this = this;
      // check if pool has newly discovered undefined props
      // if yes, update pool
      // if no, return pool
      var newUndefined = pool.filter(function (elem) {
        return !_this.undefinedPool.includes(elem);
      });
      if (newUndefined.length > 0) {
        this.undefinedPool = this.undefinedPool.concat(newUndefined);
        this.updatedMap[JSON.stringify(input)] = newUndefined;
        this.currentUpdataedMap[JSON.stringify(input)] = newUndefined;
      }
    }
  }, {
    key: "flushCurrentUpdatedMap",
    value: function flushCurrentUpdatedMap() {
      this.currentUpdataedMap = {};
    }

    /**
     * Only used for debugging for each input when running a test case
     * @returns 
     */
  }, {
    key: "getCurrentUpdatedMap",
    value: function getCurrentUpdatedMap() {
      return this.currentUpdataedMap;
    }

    // getNewUndefinedUT(){
    // 	let newUndefined = [];
    // 	for (let key in this.currentUpdataedMap) {
    // 		for (let prop in this.currentUpdataedMap[key]) {
    // 			newUndefined.push(prop);
    // 		}
    // 	}
    // 	return newUndefined;
    // }
  }, {
    key: "getUndatedPool",
    value: function getUndatedPool(pool) {
      var _this2 = this;
      var newUndefined = pool.filter(function (elem) {
        return !_this2.undefinedPool.includes(elem);
      });
      return newUndefined;
    }
  }, {
    key: "addUndefined",
    value: function addUndefined(undef) {
      this.pool.push(undef);
    }
  }, {
    key: "getUpdatedMap",
    value: function getUpdatedMap() {
      return this.updatedMap;
    }
  }, {
    key: "getUndefinedPool",
    value: function getUndefinedPool() {
      return this.undefinedPool;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.undefinedPool.length;
    }
  }]);
}();
/**
 * undefinedUTQ is used to maintain the queue of undefined props under testing
 * 
 *
 * each items in the queue consists of:
 * {
 * 	props: [],
 * 	initialInput: undefined,
 * 	withHelper: undefined,
 * 	withChain: undefined,
 * 	roundid: 0 // when does the items has been added to the queue
 * }
 * 
 */
var UndefinedUTQ = /*#__PURE__*/function () {
  function UndefinedUTQ() {
    var testFile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "backward";
    _classCallCheck(this, UndefinedUTQ);
    this.seenUndefPool = [];
    this.queue = [];
    this.currentProp = undefined;
    this.roundid = 0;
    this.secondLoad = false;
    this.order = order;
    if (testFile) {
      try {
        var data = fs.readFileSync(testFile, {
          encoding: "utf8"
        });
        this.addInitialProps(JSON.parse(data));
      } catch (err) {
        console.log(err);
      }
    } else {
      this.insert({
        props: [],
        initialInput: undefined,
        withHelper: undefined,
        withChain: undefined,
        roundid: this.roundid
      });
      this.roundid++;
    }

    /** Patching properties */
    this.helperProps = []; /** all the tested helper properties */
    this.successHelper = [];

    /** Chained properties */
    this.chainedPropsMap = {}; /** all the tested chained properties */

    /** Logging */
    this.newAddedHelper = [];
    this.newAddedChain = [];
  }
  return _createClass(UndefinedUTQ, [{
    key: "addInitialProps",
    value: function addInitialProps(props) {
      for (var i = 0; i < props.length; i++) {
        if (arraysEqual(props[i], ["_expose"])) {
          continue;
        }
        this.push({
          props: props[i],
          initialInput: undefined,
          withHelper: undefined,
          withChain: undefined,
          roundid: this.roundid
        });
        this.seenUndefPool = this.seenUndefPool.concat(props[i]);
      }
      if (this.order === "backward") {
        this.queue = this.queue.reverse();
      } else if (this.order === "random") {
        this.queue = this.queue.sort(function () {
          return Math.random() - 0.5;
        });
      } else {
        this.queue = this.queue;
      }
      this.roundid++;
    }

    /**
     * Add found helper properties to the queue
     * 
     * when testing prop1, we found [prop3, prop4, prop5] as helper properties
     * then, we add [[prop1, prop3], [prop1, prop4], [prop1, prop5]] to the queue
     * 
     * Our current strategy:
     * successHelper: helper property that will no longer cause the error
     * we test successHelper every time and for other helper properties candidate, we only test them once
     * 
     * @param {*} props 
     */
  }, {
    key: "addHelperProps",
    value: function addHelperProps(propsUT, props) {
      // let newProps = props.filter(ele => !this.helperProps.includes(ele));
      var newProps = props.reverse();
      if (this.successHelper.length > 0) {
        for (var i = 0; i < this.successHelper.length; i++) {
          if (!propsUT.includes(this.successHelper[i])) {
            this.insert({
              props: [].concat(_toConsumableArray(propsUT), [this.successHelper[i]]),
              initialInput: undefined,
              withHelper: this.successHelper[i],
              withChain: undefined,
              roundid: this.roundid
            });
            this.newAddedHelper.push([].concat(_toConsumableArray(propsUT), [this.successHelper[i]]));
          }
        }
      }
      for (var _i = 0; _i < newProps.length; _i++) {
        if (!propsUT.includes(newProps[_i]) && !this.helperProps.includes(newProps[_i])) {
          this.insert({
            props: [].concat(_toConsumableArray(propsUT), [newProps[_i]]),
            initialInput: undefined,
            withHelper: newProps[_i],
            withChain: undefined,
            roundid: this.roundid
          });
          this.helperProps.push(newProps[_i]);
          this.newAddedHelper.push([].concat(_toConsumableArray(propsUT), [newProps[_i]]));
        }
      }
      this.roundid++;
    }
  }, {
    key: "addSuccessHelper",
    value: function addSuccessHelper(props) {
      if (!this.successHelper.includes(props)) {
        this.successHelper = [].concat(_toConsumableArray(this.successHelper), [props]);
      }
    }

    /**
     * Add found chained properties to the queue (push)
     * @param {*} propsUT 
     * @param {*} undefUpdateMap: "input": [prop1, prop2, prop3]
     */
  }, {
    key: "addChainProps",
    value: function addChainProps(propsUT, undefUpdateMap) {
      for (var input in undefUpdateMap) {
        var _iterator = _createForOfIteratorHelper(undefUpdateMap[input]),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var prop = _step.value;
            // if (!this.seenUndefPool.includes(prop) && !propsUT.includes(prop)){
            if (!propsUT.includes(prop)) {
              this.push({
                props: [].concat(_toConsumableArray(propsUT), [prop]),
                initialInput: JSON.parse(input),
                withHelper: undefined,
                withChain: prop,
                roundid: this.roundid
              });
              this.chainedPropsMap[input] = prop;
              this.seenUndefPool.push(prop);
              this.newAddedChain.push(prop);
            }
            // }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      this.roundid++;
    }
  }, {
    key: "cleanUp",
    value: function cleanUp(roundid) {
      this.queue = this.queue.filter(function (item) {
        return item.roundid !== roundid || !item.withHelper;
      });
    }
  }, {
    key: "cleanNewAddedProps",
    value: function cleanNewAddedProps() {
      this.newAddedHelper = [];
      this.newAddedChain = [];
    }
  }, {
    key: "addSecondChainLayer",
    value: function addSecondChainLayer() {
      if (this.secondLoad) {
        return;
      }
      var secLayerChain = [];
      for (var i = 0; i < this.seenUndefPool.length; i++) {
        for (var j = i + 1; j < this.seenUndefPool.length; j++) {
          secLayerChain.push([this.seenUndefPool[i], this.seenUndefPool[j]]);
        }
      }
      for (var _i2 = 0; _i2 < secLayerChain.length; _i2++) {
        this.push({
          props: secLayerChain[_i2],
          initialInput: undefined,
          withHelper: undefined,
          withChain: undefined,
          roundid: this.roundid
        });
      }
      this.roundid++;
      this.secondLoad = true;
    }
  }, {
    key: "getCurrentUT",
    value: function getCurrentUT() {
      return this.currentProp;
    }
  }, {
    key: "next",
    value: function next() {
      this.currentProp = this.queue.shift();
      return this.currentProp;
    }
  }, {
    key: "push",
    value: function push(input) {
      this.queue.push(input);
    }
  }, {
    key: "insert",
    value: function insert(input) {
      this.queue.unshift(input);
    }
  }, {
    key: "pushArray",
    value: function pushArray(input) {
      this.queue = this.queue.concat(input);
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.queue.length;
    }
  }]);
}();
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
var _default = exports["default"] = {
  UndefinedPool: UndefinedPool,
  UndefinedUTQ: UndefinedUTQ
};