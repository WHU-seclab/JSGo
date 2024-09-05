"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _undefined = _interopRequireDefault(require("./undefined"));
var _config = _interopRequireDefault(require("./config"));
var _coverageAggregator = _interopRequireDefault(require("./coverage-aggregator"));
var _scheduler = _interopRequireDefault(require("./scheduler"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * This file has been adapted from the original found at expoSE+/distributor/src/center.js.
 *
 * Enhancements have been made to support the testing of multiple undefined properties. 
 * This allows us to 
 * 1/ preemptively define symbolic variables in the frontend and test them sequentially.
 * 2/ apply the strategy in the center class to determine the next undefined property
 * (or group thereof) to be tested.
 *
 * The original functionality, primarily concerned with scheduling tests for a group of undefined
 * properties under testing, has been transferred to the scheduler module.
 *
 * Modified by: jackfromeast
 */
var Center = /*#__PURE__*/function () {
  function Center() {
    _classCallCheck(this, Center);
    this.cbs = [];
    this.multiUT = false;
    this._cancelled = false;
    this.options = _config["default"];
    this.chainProp = this.options.chainProp;
    this.helperProp = this.options.helperProp;
    if (this.options.undefinedUTQ) {
      this.undefinedUTQ = new _undefined["default"].UndefinedUTQ(this.options.undefinedUTQ, this.options.testOrder);
      this.multiUT = true;
    } else {
      this.undefinedUTQ = new _undefined["default"].UndefinedUTQ(this.options.undefinedUTQ, this.options.testOrder);
      this.multiUT = false;
    }
    this.scheduler = null;
    this.curUndefined = null;
    this.logFilePath = null;
    this.logObj = {};
    this.logItems = [];
    this.curTestStartTime = null;
    this.curTestEndTime = null;
    this.id = 0;

    /**
     * This part is used for experiment RQ3
     * how long does it take to find the correct undefine property
     */
    this.startTime = Date.now();
    this.coverage = new _coverageAggregator["default"](); /** per PuT */
  }
  return _createClass(Center, [{
    key: "start",
    value: function start(file, baseInput) {
      if (this.multiUT) {
        return this.startMulti(file, baseInput);
      } else {
        return this.startSingle(file, baseInput);
      }
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.scheduler !== null) {
        this.scheduler.cancel();
      }
    }

    /**
     * We made this function synchronous
     * 
     * @param {*} file 
     * @param {*} baseInput 
     */
  }, {
    key: "startMulti",
    value: (function () {
      var _startMulti = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(file, baseInput) {
        var _this = this;
        var tpCount, done;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              // let tpflag = false;
              // let tpTime = -1;
              tpCount = 0;
              this.setupLogFile(file);
              this.curUndefined = this.undefinedUTQ.next();

              // if(this.curUndefined && this.tps.some(subArray => this._arrayEqual(this.curUndefined.props, subArray))){
              // 	tpflag = true;
              // 	tpTime = Date.now()-this.startTime;
              // }
            case 3:
              if (!this.curUndefined) {
                _context.next = 14;
                break;
              }
              this.scheduler = new _scheduler["default"](this.curUndefined, this.coverage);
              done = new Promise(function (resolve) {
                _this.scheduler.on("done", function (propsUT, newlyFoundProps, newHelperProps, success, successHelper, coverage) {
                  _this.curTestEndTime = Date.now();
                  if (successHelper) {
                    for (var i = 0, len = successHelper.length; i < len; i++) {
                      _this.undefinedUTQ.addSuccessHelper(successHelper[i]);
                    }

                    // clean up the items in the queue that used to test the helper property
                    if (success) {
                      _this.undefinedUTQ.cleanUp(_this.curUndefined.roundid);
                    }
                  }
                  if (!success && !_this.curUndefined.withHelper && _this.helperProp) {
                    _this.undefinedUTQ.addHelperProps(propsUT, newHelperProps);
                  }
                  if (!success && _this.chainProp) {
                    _this.undefinedUTQ.addChainProps(propsUT, newlyFoundProps);
                  }
                  _this.scheduler = null; // explicitly set null for garbage collection

                  var curTestTime = (_this.curTestEndTime - _this.curTestStartTime) / 1000;

                  /** coverage per undefined property test group */
                  _this.coverage = coverage;
                  // let totalLines = 0;
                  var totalRealLines = 0;
                  var totalLinesFound = 0;
                  _this.coverage["final"]().forEach(function (d) {
                    // totalLines += d.loc.total;
                    totalRealLines += d.loc.all.length;
                    totalLinesFound += d.loc.found;
                  });
                  var lineCoverage = totalLinesFound / totalRealLines * 100;
                  _this.uniquePathNum = _this.coverage.getUniquePathNum();

                  /** logging */
                  _this.log({
                    "id": _this.id++,
                    "props": propsUT,
                    "withHelper": _this.curUndefined.withHelper,
                    "withChain": _this.curUndefined.withChain,
                    "time": curTestTime,
                    "tpTime": success ? (_this.curTestEndTime - _this.startTime) / 1000 - curTestTime : -1,
                    "tpCount": tpCount++,
                    "success": success,
                    "newlyFoundProps": newlyFoundProps,
                    "addQueueHelper": _this.undefinedUTQ.newAddedHelper,
                    "addQueueChain": _this.undefinedUTQ.newAddedChain,
                    "addSuccessHelper": successHelper,
                    "roundid": _this.curUndefined.roundid,
                    "linecoverage": lineCoverage,
                    "uniquePathNum": _this.uniquePathNum,
                    "pastTime": (_this.curTestEndTime - _this.startTime) / 1000
                  }); //
                  _this.undefinedUTQ.cleanNewAddedProps();
                  _this.clearTime();
                  resolve(); // Resolve the promise, allowing the loop to continue
                });
              }); // if(this.curUndefined.props && this.tps.some(subArray => this._arrayEqual(this.curUndefined.props, subArray))){
              // 	tpflag = true;
              // 	tpTime = Date.now()-this.startTime;
              // }
              this.curTestStartTime = Date.now();
              this.scheduler.start(file, baseInput); /** this is asynchronouns call */
              _context.next = 10;
              return done;
            case 10:
              /** suspend at here */

              this.curUndefined = this.undefinedUTQ.next();
              if (!this.curUndefined && this.options.chainLayer === "2") {
                this.undefinedUTQ.addSecondChainLayer();
                this.curUndefined = this.undefinedUTQ.next();
              }
              _context.next = 3;
              break;
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function startMulti(_x, _x2) {
        return _startMulti.apply(this, arguments);
      }
      return startMulti;
    }())
  }, {
    key: "startSingle",
    value: function () {
      var _startSingle = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(file, baseInput) {
        var _this2 = this;
        var done;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              this.scheduler = new _scheduler["default"]({
                props: [],
                initialInput: baseInput,
                withHelper: false,
                withChain: false,
                roundid: 0
              });
              done = new Promise(function (resolve) {
                _this2.scheduler.on("done", function () {
                  _this2.scheduler = null; // explicitly set null for garbage collection
                  resolve(); // Resolve the promise, allowing the loop to continue
                });
              });
              this.scheduler.start(file, baseInput); /** this is asynchronouns call */
              _context2.next = 5;
              return done;
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function startSingle(_x3, _x4) {
        return _startSingle.apply(this, arguments);
      }
      return startSingle;
    }()
  }, {
    key: "addCb",
    value: function addCb(cb) {
      this.cbs.push(cb);
      return this;
    }
  }, {
    key: "log",
    value: function log(item) {
      this.logItems.push(item);
      this.logObj["tests"] = this.logItems;
      _fs["default"].writeFileSync(this.logFilePath, JSON.stringify(this.logObj, null, 2));
    }
  }, {
    key: "setupLogFile",
    value: function setupLogFile(file) {
      var dateObj = new Date();
      var logfname = "center-".concat(dateObj.getMonth() + 1, "-").concat(dateObj.getDate(), "-").concat(dateObj.getHours(), "-").concat(dateObj.getMinutes(), "-log.json");
      this.logFilePath = _path["default"].dirname(file) + "/log/summary/" + logfname;
      if (_config["default"].jsonOut) {
        this.logFilePath = _config["default"].jsonOut + "/log/summary/" + logfname;
      }

      // Ensure the log directory exists
      _fs["default"].mkdirSync(_path["default"].dirname(this.logFilePath), {
        recursive: true
      });
      this.setupLogObj(file);
    }
  }, {
    key: "setupLogObj",
    value: function setupLogObj(file) {
      this.logObj["testfile"] = file;
      this.logObj["initialUndefinedPool"] = this.undefinedUTQ.seenUndefPool;
    }
  }, {
    key: "clearTime",
    value: function clearTime() {
      this.curTestStartTime = null;
      this.curTestEndTime = null;
    }
  }, {
    key: "_arrayEqual",
    value: function _arrayEqual(a, b) {
      if (a.length !== b.length) {
        return false;
      }

      // sort both arrays
      a.sort();
      b.sort();
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
  }]);
}();
var _default = exports["default"] = Center;