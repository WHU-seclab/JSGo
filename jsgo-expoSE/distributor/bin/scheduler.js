"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _spawn = _interopRequireDefault(require("./spawn"));
var _deterministic = _interopRequireDefault(require("./strategies/deterministic"));
var _coverageAggregator = _interopRequireDefault(require("./coverage-aggregator"));
var _main = _interopRequireDefault(require("../../lib/Stats/bin/main"));
var _log = _interopRequireDefault(require("./log"));
var _undefined = _interopRequireDefault(require("./undefined"));
var _config = _interopRequireDefault(require("./config"));
var _jsonWriter = _interopRequireDefault(require("./json-writer"));
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _coverageMap = _interopRequireDefault(require("./coverage-map"));
var _internal = _interopRequireDefault(require("./internal"));
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
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * This file is used to schedule the multiple running tests given a (group of) undefined property under testing
 */
var EventEmitter = require("events");
var Scheduler = /*#__PURE__*/function (_EventEmitter) {
  function Scheduler(propUnderTest) {
    var _this;
    var coverage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    _classCallCheck(this, Scheduler);
    _this = _callSuper(this, Scheduler);
    _this.cbs = [];
    _this._cancelled = false;
    _this.options = _config["default"];
    _this._lastid = 0;
    _this._done = [];
    _this._errors = 0;
    _this._running = [];
    _this.undefinedPool = new _undefined["default"].UndefinedPool(_this.options.undefinedFile);
    _this._coverage = new _coverageAggregator["default"](); /** per Test Unit */
    _this._sharedCoverage = coverage; /** per PuT */
    _this._stats = new _main["default"]();

    /**
           * propUnderTest could be empty
           * meaning the symbolic variables are defined in the test file itself
           */
    _this.undefinedUT = propUnderTest.props;
    _this.withHelper = propUnderTest.withHelper;
    _this.withChain = propUnderTest.withChain;
    _this.input = propUnderTest.initialInput;
    _this.forinLoad = false;
    _this.helperPool = new _undefined["default"].UndefinedPool();
    _this.successHelpers = [];

    /** initialized in start method */
    _this.timeout = null;
    _this.starttime = null;
    _this.firsthittime = null;
    _this.file = null;
    _this.baseInput = null;
    _this.success = 0;
    return _this;
  }
  _inherits(Scheduler, _EventEmitter);
  return _createClass(Scheduler, [{
    key: "start",
    value: function start(file, baseInput) {
      var _this2 = this;
      this.file = file;
      this.baseInput = baseInput;
      this.starttime = new Date().getTime();
      this._startTesting([{
        id: this._nextID(),
        path: file,
        input: this.input || baseInput || {
          _bound: 0
        },
        /** baseInput is the input passed from the commandline */
        undefinedUT: this.undefinedUT,
        forinLoad: this.forinLoad,
        withHelper: this.withHelper,
        withChain: this.withChain
      }]);
      this.timeout = setTimeout(function () {
        _this2.cancel();
      }, this.withHelper ? this.options.withHelperMaxTime : this.options.undefMaxTime);
      return this;
    }

    /**
     * It won't cancel all the running test immediately
     * It will wait for the current test to finish
     * 
     * Due to the fact that _testFileDone callback is synchronous
     * So it will take time to process the result of each test
     */
  }, {
    key: "cancel",
    value: function cancel() {
      this._cancelled = true;
      this._running.forEach(function (test) {
        return test.kill();
      });
      // this._finishedTesting();
    }
  }, {
    key: "addCb",
    value: function addCb(cb) {
      this.cbs.push(cb);
      return this;
    }
  }, {
    key: "_startTesting",
    value: function _startTesting(cases) {
      var _this3 = this;
      this._strategy = new _deterministic["default"]();
      cases.forEach(function (i) {
        return _this3._strategy.add(i);
      });
      this._requeue();
      this._printUndefined();
      this._printStatus();
    }

    /**
        * Queue as many tests as possible
        * 
        * This function seves as synchronization point for the scheduler
        */
  }, {
    key: "_requeue",
    value: function _requeue() {
      while (this._strategy.length() && this._canStart()) {
        this._startNext();
      }
    }

    /**
        * If there is a slot & under max paths start an additional test
        */
  }, {
    key: "_startNext",
    value: function _startNext() {
      if (this._strategy.length()) {
        this._testFile(this._strategy.next());
      }
    }

    /**
        * True if another test can begin
        */
  }, {
    key: "_canStart",
    value: function _canStart() {
      return !this._cancelled && this._running.length < this.options.maxConcurrent;
    }
  }, {
    key: "_remove",
    value: function _remove(test) {
      var idx = this._running.indexOf(test);
      if (idx != -1) {
        this._running.splice(idx, 1);
      }
    }
  }, {
    key: "_postTest",
    value: function _postTest(test) {
      this._remove(test);

      // Start any remaining queued
      this._requeue();
      this._printStatus();
      this._printNewUndefined();

      // If the test has completed, exit the current scheduler
      if (!this._running.length) {
        clearTimeout(this.timeout);
        this._finishedTesting();
      }
    }

    /**
        * Exit point of the scheduler
        * being called when
        * 1/ complete: no more tests to run
        * 2/ timeout:  received a cancel signal from the center
        * 
        * `done` event emittion has been explicitly implemented 1/ cancel func 2/ _postTest func
        */
  }, {
    key: "_finishedTesting",
    value: function _finishedTesting() {
      var _this4 = this;
      // call all the callbacks
      this.cbs.forEach(function (cb) {
        return cb(_this4, _this4._done, _this4._errors, _this4._coverage, _this4._stats["final"](), _this4.undefinedPool.getUpdatedMap());
      });

      // summary
      this._summary();

      // emit done event
      this.emit("done", this.undefinedUT, this.undefinedPool.getUpdatedMap(), this.helperPool.getUndefinedPool(), this.success, this.successHelpers, this._sharedCoverage);
    }
  }, {
    key: "_nextID",
    value: function _nextID() {
      return this._lastid++;
    }
  }, {
    key: "_countVal",
    value: function _countVal(input, value) {
      var count = 0;
      for (var _i = 0, _Object$keys = Object.keys(input); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        if (key.endsWith("_t") && input[key] === value) {
          count++;
        }
      }
      return count;
    }

    /**
     * Sort the child input by the number of undefined, string type symbols
     * We want to prioritize the input from simple to complex
     * @param {*} array: alternative input in this round
     * @returns 
     */
  }, {
    key: "_strategicallySort",
    value: function _strategicallySort(array) {
      var _this5 = this;
      return array.sort(function (a, b) {
        var undefinedCountA = _this5._countVal(a.input, "undefined");
        var undefinedCountB = _this5._countVal(b.input, "undefined");
        if (undefinedCountA !== undefinedCountB) {
          // Higher count of "undefined" values comes first
          return undefinedCountB - undefinedCountA;
        } else {
          // If counts of "undefined" values are equal, sort by count of "string" values
          var stringCountA = _this5._countVal(a.input, "string");
          var stringCountB = _this5._countVal(b.input, "string");
          return stringCountB - stringCountA;
        }
      });
    }
  }, {
    key: "_expandAlternatives",
    value: function _expandAlternatives(file, alternatives, testCoverage) {
      var _this6 = this;
      alternatives = this._strategicallySort(alternatives);
      alternatives.forEach(function (alt) {
        _this6._strategy.add({
          id: _this6._nextID(),
          path: file.path,
          input: alt.input,
          pc: alt.pc,
          undefinedUT: _this6.undefinedUT,
          withHelper: _this6.withHelper,
          withChain: _this6.withChain,
          forinLoad: alt.forinLoad,
          forinKeys: alt.forinKeys,
          forinKeyBound: alt.forinKeyBound
        }, alt, testCoverage);
      });
    }
  }, {
    key: "_pushDone",
    value: function _pushDone(test, input, pc, pcString, alternatives, result, undefinedUT, undefinedPool, helperPool, successHelper, forinLoad, coverage, errors) {
      this._done.push({
        id: test.file.id,
        input: input,
        undefinedUT: undefinedUT,
        pc: pc,
        pcString: pcString,
        result: result,
        errors: errors,
        undefinedPool: this.undefinedPool.getUndatedPool(undefinedPool),
        helperPool: this.helperPool.getUndatedPool(helperPool),
        successHelper: successHelper,
        forinLoad: forinLoad,
        time: test.time(),
        startTime: test.startTime(),
        coverage: this._coverage.current(),
        case_coverage: this.options.perCaseCoverage ? new _coverageAggregator["default"]().add(coverage)["final"](true) : undefined,
        replay: test.makeReplayString(),
        alternatives: alternatives
      });
      if (errors.length) {
        this._errors += 1;
      }
    }
  }, {
    key: "_testFileDone",
    value: function _testFileDone(spawn, code, test, finalOut, coverage, fsErrors) {
      var errors = fsErrors;
      if (code != 0) {
        errors.push({
          error: "Exit code non-zero"
        });
      }
      if (coverage) {
        this._coverage.add(coverage);
        if (this._sharedCoverage) {
          this._sharedCoverage.add(coverage);
        }
      }
      if (finalOut) {
        this._pushDone(test, finalOut.input, finalOut.pc, finalOut.pcString, finalOut.alternatives, finalOut.result, finalOut.undefinedUT, finalOut.undefinedPool, finalOut.helperPool, finalOut.successHelper, finalOut.forinLoad, coverage, errors.concat(finalOut.errors));
        /*
        this._expandAlternatives(test.file, finalOut.alternatives, coverage);
        this._stats.merge(finalOut.stats);
        this.undefinedPool.updatePool(finalOut.input, finalOut.undefinedPool);
        this.helperPool.updatePool(finalOut.input, finalOut.helperPool);
        */

        if (finalOut.successHelper) {
          if (!this.successHelpers.includes(finalOut.successHelper)) {
            this.successHelpers.push(finalOut.successHelper);
          }
        }
        if (finalOut.result && !this.success) {
          this.firsthittime = new Date().getTime();
        }
        if (finalOut.result) {
          this.success += 1;
        }
      } else {
        this._pushDone(test, test.file.input, test.file.pc, test.file.pcString, [], false, this.undefinedUT, [], [], undefined, false, coverage, errors.concat([{
          error: "Error extracting final output - a fatal error must have occured"
        }]));
      }
      this._postTest(test);
    }

    /**
        * Where the spawn is created
        * 
        * @param {*} file 
        */
  }, {
    key: "_testFile",
    value: function _testFile(file) {
      this.undefinedPool.flushCurrentUpdatedMap();
      var nextTest = new _spawn["default"](this.options.analyseScript, file, {
        undefinedPool: this.undefinedPool.getUndefinedPool(),
        log: this.options.printPaths,
        timeout: this.options.testMaxTime
      });
      this._running.push(nextTest.start(this._testFileDone.bind(this)));
      this._printStatus();
    }
  }, {
    key: "_printStatus",
    value: function _printStatus() {
      (0, _log["default"])("[" + this._done.length + " done /" + this._strategy.length() + " queued / " + this._running.length + " running / " + this._errors + " errors / " + this._coverage.current().loc.toFixed(2) * 100 + "% coverage ] ***\n");
    }
  }, {
    key: "_printCurrentUndefinedUT",
    value: function _printCurrentUndefinedUT() {
      (0, _log["default"])("Current Undefined Property Under Testing: ".concat(this.undefinedUT, "\n"));
    }
  }, {
    key: "_printUndefined",
    value: function _printUndefined() {
      (0, _log["default"])("Current Undefined Pool has ".concat(this.undefinedPool.getLength(), " properties: ").concat(JSON.stringify(this.undefinedPool.getUndefinedPool()), "\n"));
    }
  }, {
    key: "_printNewUndefined",
    value: function _printNewUndefined() {
      if (this.undefinedPool.getCurrentUpdatedMap().length > 0) {
        (0, _log["default"])("Newly Discovered Undefined Props: ".concat(JSON.stringify(this.undefinedPool.getCurrentUpdatedMap()), "\n"));
      }
    }

    /**
        * called when the exiting the current scheduler
        * 
        * 1/ write the info to the log file
        * 2/ print out the stats/coverage/error/newly discovered undefined props/replay
        */
  }, {
    key: "_summary",
    value: function _summary() {
      (0, _log["default"])("======================================== ENDING TEST RUN: ".concat(this.undefinedUT, " ========================================\n"));
      var logFilePath = this._setupLogFile();
      var newUndefinedMap = this.undefinedPool.getUpdatedMap();
      var firstHitTime;
      if (this.success) {
        firstHitTime = (this.firsthittime - this.starttime) / 1000;
      } else {
        firstHitTime = "-1";
      }
      (0, _jsonWriter["default"])(logFilePath, this.file, this._coverage, this.starttime, new Date().getTime(), firstHitTime, newUndefinedMap, this._done);
      function round(num, precision) {
        return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
      }
      function formatSeconds(v) {
        return round(v / 1000, 4);
      }
      this._done.forEach(function (item) {
        var pcPart = _config["default"].printPathCondition ? " PC: ".concat(item.pc) : "";
        console.log("[+] ".concat(JSON.stringify(item.input)).concat(pcPart, " took ").concat(formatSeconds(item.time), "s"));
        item.errors.forEach(function (error) {
          return console.log("[!] ".concat(error.error));
        });
        if (item.errors.length != 0) {
          console.log("[!] ".concat(item.replay));
        }
      });
      console.log("[!] Newly Found Undefined Properties: ");
      for (var key in newUndefinedMap) {
        console.log("[+] ".concat(key, ": ").concat(newUndefinedMap[key].toString()));
      }
      console.log("[!] Stats");
      for (var stat in this.stats) {
        console.log("[+] ".concat(stat, ": ").concat(JSON.stringify(this.stats[stat].payload)));
      }
      console.log("[!] Done");
      var totalLines = 0;
      var totalRealLines = 0;
      var totalLinesFound = 0;
      this._coverage["final"]().forEach(function (d) {
        if ((0, _internal["default"])(d.file)) {
          return;
        }
        console.log("[+] ".concat(d.file, ". Coverage (Term): ").concat(Math.round(d.terms.coverage * 100), "% Coverage (Decisions): ").concat(Math.round(d.decisions.coverage * 100), "% Coverage (LOC): ").concat(Math.round(d.loc.coverage * 100), "% Lines Of Code: ").concat(d.loc.total, " -*"));
        totalLines += d.loc.total;
        totalRealLines += d.loc.all.length;
        totalLinesFound += d.loc.found;
      });
      Math.round(totalLinesFound / totalRealLines * 10000) / 100;
      console.log("[+] Total Lines Of Code ".concat(totalLines));
      console.log("[+] Total Coverage: ".concat(totalLinesFound / totalRealLines, "%"));
      console.log("[+] Total Unique Paths: ".concat(this._coverage.getUniquePathNum()));
      if (_config["default"].printDeltaCoverage) {
        (0, _coverageMap["default"])(this._coverage.lines(), function (line) {
          return console.log(line);
        });
      } else {
        console.log("[+] EXPOSE_PRINT_COVERAGE=1 for line by line breakdown");
      }
      console.log("[+] ExpoSE Finished Testing: ".concat(this.undefinedUT.length > 0 ? this.undefinedUT : "unknown", ", ").concat(this._done.length, " paths, ").concat(this._errors, " errors"));
      (0, _log["default"])("======================================== ENDING TEST RUN ========================================\n");
    }
  }, {
    key: "_setupLogFile",
    value: function _setupLogFile() {
      var dateObj = new Date();
      // let fname = path.basename(this.file).replace(".js","");

      var logUndefPropName = [];
      if (this.undefinedUT.length > 0) {
        for (var i = 0; i < this.undefinedUT.length; i++) {
          if (/\n|\s|[/]/.test(this.undefinedUT[i])) {
            logUndefPropName[i] = "longString".concat(dateObj.getSeconds());
          } else {
            logUndefPropName[i] = this.undefinedUT[i];
          }
        }
      }
      var logfname = "".concat(this.undefinedUT.length > 0 ? logUndefPropName.join("-") : "unknown", "-").concat(dateObj.getMonth() + 1, "-").concat(dateObj.getDate(), "-").concat(dateObj.getHours(), "-").concat(dateObj.getMinutes(), "-log.json");
      var logFilePath = _path["default"].dirname(this.file) + "/log/" + logfname;
      if (_config["default"].jsonOut) {
        logFilePath = _config["default"].jsonOut + "/log/" + logfname;
      }

      // Ensure the log directory exists
      _fs["default"].mkdirSync(_path["default"].dirname(logFilePath), {
        recursive: true
      });
      console.log("[+] Writing output to ".concat(logFilePath));
      return logFilePath;
    }
  }]);
}(EventEmitter);
var _default = exports["default"] = Scheduler;