"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _wrappedValues = require("./values/wrapped-values");
var _symbolicObject = require("./values/symbolic-object");
var _objectHelper = _interopRequireDefault(require("./utilities/object-helper"));
var _symbolicState = _interopRequireDefault(require("./symbolic-state"));
var _log = _interopRequireDefault(require("./utilities/log"));
var _errorException = _interopRequireDefault(require("./error-exception"));
var _IsNative = require("./utilities/IsNative");
var _models = _interopRequireDefault(require("./models/models"));
var _external = _interopRequireDefault(require("./external"));
var _typeCoercion = require("./type-coercion");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2014@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */ // JALANGI DO NOT INSTRUMENT
/**
 * Looks like the Hook function provided by the jalangji2
 */ /*global window*/ /*global Element*/ /*global document*/
var fs = require("fs");
var SymbolicExecution = /*#__PURE__*/function () {
  function SymbolicExecution(sandbox, initialInput, undefinedUnderTest, inherit, exitFn) {
    var _this = this;
    _classCallCheck(this, SymbolicExecution);
    this._sandbox = sandbox;
    this.state = new _symbolicState["default"](initialInput, undefinedUnderTest, inherit, this._sandbox);
    this.models = (0, _models["default"])(this.state);
    this._fileList = new Array();
    this._exitFn = exitFn;
    if (typeof window !== "undefined") {
      window._ExpoSE = this;
      setTimeout(function () {
        console.log("Finish timeout (callback)");
        _this.finished();
        _external["default"].close();
      }, 1000 * 60 * 1);
      var storagePool = {};
      window.localStorage.setItem = function (key, val) {
        storagePool[key] = val;
      };
      window.localStorage.getItem = function (key) {
        return storagePool[key];
      };
      console.log("Browser mode setup finished");
    } else {
      var process = _external["default"].load("process");

      //Bind any uncaught exceptions to the uncaught exception handler
      process.on("uncaughtException", this._uncaughtException.bind(this));

      //Bind the exit handler to the exit callback supplied
      process.on("exit", this.finished.bind(this));
    }
  }
  return _createClass(SymbolicExecution, [{
    key: "finished",
    value: function finished() {
      this._exitFn(this.state, this.state.coverage);
    }

    /**
     * Hook function for uncaught exceptions and throwed errors
     * 
     * check whether the exception is due to the unexpected loading of polluted value
     * if it is, set this.retHelper to ture which will return current state.helperCandidates
     * 
     * @param {*} e: Exception
     * @returns 
     */
  }, {
    key: "_uncaughtException",
    value: function _uncaughtException(e) {
      //Ignore NotAnErrorException
      if (e instanceof _errorException["default"].NotAnErrorException) {
        return;
      }
      if (_errorException["default"].isUndefCausedError(e)) {
        _log["default"].log("Uncaught exception ".concat(e));
        _log["default"].log("Assume it is due to the unexpected loading of polluted value, decide to explore the helper candidates.");
        this.state.retHelper = true;
      } else {
        _log["default"].log("Uncaught exception ".concat(e, " Stack: ").concat(e.stack ? e.stack : ""));
      }
      this.state.errors.push({
        error: "" + e,
        stack: e.stack
      });
    }
  }, {
    key: "report",
    value: function report(sourceString) {
      if (sourceString && !this.state.isSymbolic(sourceString)) {
        if (sourceString.documentURI) {
          sourceString = "" + sourceString.documentURI;
        } else if (sourceString.baseURI) {
          sourceString = "" + sourceString.baseURI;
        } else if (sourceString && sourceString.toString) {
          var tsourceString = sourceString.toString();
          if (tsourceString.includes("Object]")) {
            sourceString = _objectHelper["default"].asString(sourceString);
          } else {
            sourceString = tsourceString;
          }
        } else {
          sourceString = _objectHelper["default"].asString(sourceString);
        }
      } else {
        sourceString = this.state.asSymbolic(sourceString).simplify();
      }
      console.log("OUTPUT_LOAD_EVENT: !!!".concat(this.state.inlineToSMTLib(), "!!! !!!\"").concat(sourceString, "\"!!!"));
    }
  }, {
    key: "_reportFn",
    value: function _reportFn(f, base, args) {
      if (typeof window !== "undefined") {
        if ((f.name == "appendChild" || f.name == "prependChild" || f.name == "insertBefore" || f.name == "replaceChild") && args[0] && (args[0].src || args[0].innerHTML.includes("src="))) {
          this.report(args[0].src);
          args[0].src = this.state.getConcrete(args[0].src);
        }
        if (f.name == "open" || f.name == "fetch") {
          this.report(args[1]);
        }
      }
    }

    /** jackfromeast
     * symbolicCheckForEvalLikeFunctions
     * @param {*} f 
     * @param {*} args 
     * @param {*} state 
     * @returns 
     */
  }, {
    key: "OldsymbolicCheckForEvalLikeFunctions",
    value: function OldsymbolicCheckForEvalLikeFunctions(f, args, state) {
      switch (f.name) {
        case "eval":
          return state.isSymbolic(args[0]);
        case "Function":
          return Array.from(args).some(function (arg) {
            return state.isSymbolic(arg);
          });
        case "execScript":
          return state.isSymbolic(args[0]);
        case "executeJavaScript":
          return state.isSymbolic(args[0]);
        case "execCommand":
          return state.isSymbolic(args[0]);
        case "setTimeout":
          return state.isSymbolic(args[0]);
        case "setInterval":
          return state.isSymbolic(args[0]);
        case "setImmediate":
          return state.isSymbolic(args[0]);
        default:
          return false;
      }
    }
  }, {
    key: "symbolicCheckForEvalLikeFunctions",
    value: function symbolicCheckForEvalLikeFunctions(f, args, state) {
      if (f === eval) {
        return state.isSymbolic(args[0]);
      } else if (f === Function) {
        return Array.from(args).some(function (arg) {
          return state.isSymbolic(arg);
        });
      } else if (f === setTimeout) {
        return state.isSymbolic(args[0]);
      } else if (f === setInterval) {
        return state.isSymbolic(args[0]);
      } else if (f === setImmediate) {
        return state.isSymbolic(args[0]);
      } else {
        return false;
      }
    }

    /** jackfromeast
     * need to check whether this is correct
     * @param {*} f 
     * @param {*} args 
     * @param {*} state 
     * @returns 
     */
  }, {
    key: "symbolicCheckForFileAccessFunction",
    value: function symbolicCheckForFileAccessFunction(f, args, state) {
      if (f === fs.readFile || f === fs.readFileSync) {
        return state.isSymbolic(args[0]);
      } else if (f === fs.writeFile || f === fs.writeFileSync) {
        return state.isSymbolic(args[0]) || state.isSymbolic(args[1]);
      } else {
        return false;
      }
    }
  }, {
    key: "symbolicCheckForSinkFunctions",
    value: function symbolicCheckForSinkFunctions(f, args, state) {
      return this.symbolicCheckForEvalLikeFunctions(f, args, state) || this.symbolicCheckForFileAccessFunction(f, args, state);
    }
  }, {
    key: "invokeFunPre",
    value: function invokeFunPre(iid, f, base, args, _isConstructor, _isMethod) {
      var _this2 = this;
      this.state.coverage.touch(iid);
      /** jackfromeast
      	 * add symbolic check for eval-like functions
       * check whether the argument of eval-like functions are symbolic, which usually means that our undefined property has flows to the sink
       */
      if (f && this.symbolicCheckForSinkFunctions(f, args, this.state)) {
        _log["default"].logSink("Found a potential flow to the sink: " + f.name + " at" + this._location(iid).toString());
        _log["default"].logSink("Current input: " + JSON.stringify(this.state.input));
        _log["default"].logSink("Current state: " + this.state.pathCondition.map(function (x) {
          return x.ast;
        }));
        this.state.foundGadgets();
      }
      f = this.state.getConcrete(f);
      this._reportFn(f, base, args);
      var functionName = f ? f.name : "undefined";
      var fn_model = this.models.get(f);
      /** jackfromeast
       * 
       * If non of the base and arguments are symbolic, we do not need to call the model function
       * base is the object that the function is called on like this.buf.join()
       * If non of the arguments  are symbolic, we do not need to call the model function
       * Probably there are several cases that modeled function are needed, but currently I just ignore them
       */
      if (!this.state.isSymbolicDeep(base) && !Object.values(args).some(function (x) {
        return _this2.state.isSymbolicDeep(x) || x instanceof _symbolicObject.SymbolicObject;
      })) {
        return {
          f: f,
          base: base,
          args: args,
          skip: false
        };
      }

      /**
       * Concretize the function if it is native and we do not have a custom model for it
       * TODO: We force concretization on toString functions to avoid recursive call from the lookup into this.models
       * TODO: This is caused by getField(obj) calling obj.toString()
       * TODO: A better solution to this needs to be found
       */
      if (!fn_model && (0, _IsNative.isNative)(f)) {
        var concretized = this.state.concretizeCall(f, base, args);
        base = concretized.base;
        args = concretized.args;
        if (concretized.count > 0) {
          this.state.stats.set("Unmodeled Function Call", functionName);
        }
      } else if (fn_model) {
        this.state.stats.set("Modeled Function Call", functionName);
      } else {
        this.state.stats.seen("General Function Call");
      }

      /**
       * End of conc
       */
      return {
        f: fn_model || f,
        base: base,
        args: args,
        skip: false
      };
    }

    /**
     * Called after a function completes execution
     */
  }, {
    key: "invokeFun",
    value: function invokeFun(iid, f, base, args, result, _isConstructor, _isMethod) {
      this.state.coverage.touch(iid);
      return {
        result: result
      };
    }
  }, {
    key: "literal",
    value: function literal(iid, val, _hasGetterSetter) {
      this.state.coverage.touch(iid);
      return {
        result: val
      };
    }
  }, {
    key: "forinObject",
    value: function forinObject(iid, val) {
      this.state.coverage.touch(iid);

      // currently, we only support one symbolic key-value pair
      if (this.state.forinLoad && !this.state.forinIndex) {
        // add both symbolic key and value to prototype, which will be looped over
        var key = "forin_".concat(this.state.forinIndex++);
        var keyType = this.state.createSymbolicValueType(key + "_key_undef_t", "string");
        this.state.assertEqual(keyType, this.state.concolic("string"));
        this.state.input._bound += 1;
        this.state.symbolicKey[key] = this.state.createSymbolicValue(key + "_key_undef", key);

        // setup the corresponding symbolic value in the root prototype
        var keyValue = this.state.createPureSymbol(key + "_undef");
        this.state.setupUndefined(key, keyValue);
      }

      // jackfromeast
      // if the object is symbolic, we will enumerate its concrete properties
      if (this.state.isSymbolic(val)) {
        return {
          result: this.state.getConcrete(val)
        };
      }
      return {
        result: val
      };
    }
  }, {
    key: "_location",
    value: function _location(iid) {
      return this._sandbox.iidToLocation(this._sandbox.getGlobalIID(iid));
    }
  }, {
    key: "endExpression",
    value: function endExpression(iid) {
      this.state.coverage.touch(iid);
    }
  }, {
    key: "declare",
    value: function declare(iid, name, val, _isArgument, _argumentIndex, _isCatchParam) {
      this.state.coverage.touch(iid);
      return {
        result: val
      };
    }
  }, {
    key: "_filterPath",
    value: function _filterPath(path) {
      // filter out the path that contains the following strings

      if (path.includes("acorn") || path.includes("babel") || path.includes("mime")) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * Filter out the property by its name
     * @param {*} prop 
     */
  }, {
    key: "_filterProp",
    value: function _filterProp(prop) {
      // numberic like property name will be filtered out
      // '1', '2', '3'
      if (!isNaN(parseFloat(prop)) && isFinite(prop)) {
        return true;
      } else if (prop === "undefined") {
        return true;
      } else if (prop.includes("Symbol(")) {
        return true;
      }
      return false;
    }
  }, {
    key: "getFieldPre",
    value: function getFieldPre(iid, base, offset, _isComputed, _isOpAssign, _isMethodCall) {
      this.state.coverage.touch(iid);

      // check undefined properties
      // our polluted undefined properties will also be assessed in symbols.js, exclude them
      if (base && !this.state.isSymbolic(offset) && !offset.toString().endsWith("_undef")) {
        if (base[offset] === undefined && !this._filterPath(this._location(iid).toString()) && !this._filterProp(offset.toString())) {
          // if this.state.undefinedPool does not contain this offset, add it to the pool
          if (!this.state.undefinedPool.includes(offset.toString())) {
            _log["default"].logUndefined("Found undefined property: " + offset.toString() + " at " + this._location(iid).toString());
            this.state.undefinedPool.push(offset.toString());
          }

          // for the helper candidates
          // we collect all the undefined property lookups after the first time of polluted value loaded
          if (this.state.hasLoaded) {
            this.state.addHelperCandidate(offset.toString());
            // this.state.helperCandidates.push(offset.toString());
          }
        }
      }

      /**
       * log the first access to the polluted value in root prototype
       * no symbolic value should be loaded yet
       * 
       * FIXME: test this logic
       */
      if (!this.state.hasLoaded) {
        try {
          if (this.state.undefinedUnderTest.includes(offset) && !base.hasOwnProperty(offset)) {
            this.state.hasLoaded = true;
          }
        } catch (e) {
          if (this.state.isSymbolic(offset) || this.state.isSymbolic(base)) {
            throw "Symbolic value shouldn't load before this.state.hasLoaded = false";
          }
        }
      }

      // For the pure symbol
      // However, the method call also triggers getFieldPre, so it does not nessarily mean that the base is a object
      if (this.state.isPureSymbol(base)) {
        base.addType("method", "getField", undefined, offset);
      }
      return {
        base: base,
        offset: offset,
        skip: this.state.isWrapped(base) || this.state.isWrapped(offset)
      };
    }
  }, {
    key: "_getFieldSymbolicOffset",
    value: function _getFieldSymbolicOffset(base, offset) {
      offset = this.state.ToString(offset);
      var base_c = this.state.getConcrete(base);

      // these are parallel constraints
      for (var idx in base_c) {
        var is_this_idx = this.state.binary("==", idx, offset);
        this.state.conditional(this.state.asSymbolic(is_this_idx));
      }
      // this.state.parallelid++;
    }

    /** 
        * GetField will be skipped if the base or offset is not wrapped (SymbolicObject or isSymbolic)
        */
  }, {
    key: "getField",
    value: function getField(iid, base, offset, _val, _isComputed, _isOpAssign, _isMethodCall) {
      //TODO: This is a horrible hacky way of making certain request attributes symbolic
      //TODO: Fix this!
      if (typeof window != "undefined") {
        if (base == window.navigator) {
          if (offset == "userAgent") {
            return {
              result: Object._expose.makeSymbolic(offset, window.navigator.userAgent)
            };
          }
        }
        if (base == window.document) {
          if (offset == "cookie") {
            return {
              result: Object._expose.makeSymbolic(offset, "")
            };
          }
          if (offset == "lastModified") {
            return {
              result: Object._expose.makeSymbolic(offset, window.document.lastModified)
            };
          }
          if (offset == "referrer") {
            return {
              result: Object._expose.makeSymbolic(offset, window.document.referer)
            };
          }
        }
        if (base == window.location) {
          if (offset == "origin") {
            return {
              result: Object._expose.makeSymbolic(offset, window.location.origin)
            };
          }
          if (offset == "host") {
            return {
              result: Object._expose.makeSymbolic(offset, window.location.host)
            };
          }
        }
      }
      //If dealing with a SymbolicObject then concretize the offset and defer to SymbolicObject.getField
      if (base instanceof _symbolicObject.SymbolicObject) {
        return {
          result: base.getField(this.state, this.state.getConcrete(offset))
        };
      }

      //If we are evaluating a symbolic string offset on a concrete base then enumerate all fields
      //Then return the concrete lookup
      if (!this.state.isSymbolic(base) && this.state.isSymbolic(offset) && typeof this.state.getConcrete(offset) == "string" && !/^forin_\d+$/.test(this.state.getConcrete(offset))) {
        this._getFieldSymbolicOffset(base, offset);
        return {
          result: base[this.state.getConcrete(offset)]
        };
      }

      //If the array is a symbolic int and the base is a concrete array then enumerate all the indices
      if (!this.state.isSymbolic(base) && this.state.isSymbolic(offset) && this.state.getConcrete(base) instanceof Array && typeof this.state.getConcrete(offset) == "number") {
        for (var i = 0; i < this.state.getConcrete(base).length; i++) {
          this.state.assertEqual(i, offset);
        }
        return {
          result: base[this.state.getConcrete(offset)]
        };
      }

      //Otherwise defer to symbolicField
      var result_s = this.state.isSymbolic(base) ? this.state.symbolicField(this.state.getConcrete(base), this.state.asSymbolic(base), this.state.getConcrete(offset), this.state.asSymbolic(offset)) : undefined;
      var result_c = this.state.getConcrete(base)[this.state.getConcrete(offset)];
      return {
        result: result_s ? new _wrappedValues.ConcolicValue(result_c, result_s) : result_c
      };
    }
  }, {
    key: "putFieldPre",
    value: function putFieldPre(iid, base, offset, val, _isComputed, _isOpAssign) {
      this.state.coverage.touch(iid);
      // for the pure symbol
      if (this.state.isPureSymbol(base)) {
        base.addType("method", "putField");
      }
      return {
        base: base,
        offset: offset,
        val: val,
        skip: this.state.isWrapped(base) || this.state.isWrapped(offset)
      };
    }
  }, {
    key: "putField",
    value: function putField(iid, base, offset, val, _isComputed, _isOpAssign) {
      if (base instanceof _symbolicObject.SymbolicObject) {
        return {
          result: base.setField(this.state, this.state.getConcrete(offset), val)
        };
      }

      //TODO: Enumerate if symbolic offset and concrete input

      if (this.state.isSymbolic(base) && this.state.getConcrete(base) instanceof Array && this.state.arrayType(base) == _typeof(val)) {
        _log["default"].log("TODO: Check that setField is homogonous");

        //SetField produce a new array
        //Therefore the symbolic portion of base needs to be updated
        var base_s = this.state.asSymbolic(base).setField(this.state.asSymbolic(offset), this.state.asSymbolic(val));
        this.state.getConcrete(base)[this.state.getConcrete(offset)] = val;
        this.state.updateSymbolic(base, base_s);
        if (typeof document !== "undefined" && this.state.getConcrete(base) instanceof Element && document.contains(this.state.getConcrete(base)) && offset === "innerHTML") {
          var tv = this.state.getConcrete(val);
          if (typeof tv === "string" && tv.includes("src=")) {
            var sourceString = this.state.asSymbolic(val).toString();
            this.report(sourceString);
          }
        }
        return {
          result: val
        };
      }
      this.state.getConcrete(base)[this.state.getConcrete(offset)] = val;
      return {
        result: val
      };
    }
  }, {
    key: "read",
    value: function read(iid, name, val, _isGlobal, _isScriptLocal) {
      this.state.coverage.touch(iid);
      return {
        result: val
      };
    }
  }, {
    key: "write",
    value: function write(iid, name, val, _lhs, _isGlobal, _isScriptLocal) {
      this.state.coverage.touch(iid);
      // convert the key to a symbolic key
      if (Object.keys(this.state.symbolicKey).includes(val)) {
        val = this.state.symbolicKey[val];
      }
      return {
        result: val
      };
    }
  }, {
    key: "_return",
    value: function _return(iid, val) {
      this.state.coverage.touch(iid);
      return {
        result: val
      };
    }
  }, {
    key: "_throw",
    value: function _throw(iid, val) {
      this.state.coverage.touch(iid);
      return {
        result: val
      };
    }
  }, {
    key: "_with",
    value: function _with(iid, val) {
      this.state.coverage.touch(iid);
      return {
        result: val
      };
    }
  }, {
    key: "functionEnter",
    value: function functionEnter(iid, f, _dis, _args) {
      this.state.coverage.touch(iid);
    }
  }, {
    key: "functionExit",
    value: function functionExit(iid, returnVal, wrappedExceptionVal) {
      this.state.coverage.touch(iid);
      return {
        returnVal: returnVal,
        wrappedExceptionVal: wrappedExceptionVal,
        isBacktrack: false
      };
    }
  }, {
    key: "_scriptDepth",
    value: function _scriptDepth() {
      return this._fileList.length;
    }
  }, {
    key: "_addScript",
    value: function _addScript(fd) {
      this._fileList.push(fd);
    }
  }, {
    key: "_removeScript",
    value: function _removeScript() {
      return this._fileList.pop();
    }
  }, {
    key: "scriptEnter",
    value: function scriptEnter(iid, instrumentedFileName, originalFileName) {
      //this.state.coverage.touch(iid);

      var enterString = "====== ENTERING SCRIPT ".concat(originalFileName, " depth ").concat(this._scriptDepth(), " ======");
      if (this._scriptDepth() == 0) {
        _log["default"].log(enterString);
      } else {}
      this._addScript(originalFileName);
    }
  }, {
    key: "scriptExit",
    value: function scriptExit(iid, wrappedExceptionVal) {
      //this.state.coverage.touch(iid);

      var originalFileName = this._removeScript();
      var exitString = "====== EXITING SCRIPT ".concat(originalFileName, " depth ").concat(this._scriptDepth(), " ======");
      if (this._scriptDepth() > 0) {} else {
        _log["default"].log(exitString);
      }
      return {
        wrappedExceptionVal: wrappedExceptionVal,
        isBacktrack: false
      };
    }
  }, {
    key: "binaryPre",
    value: function binaryPre(iid, op, left, right, _isOpAssign, _isSwitchCaseComparison, _isComputed) {
      // For the pure symbol
      if (this.state.isPureSymbol(left) || this.state.isPureSymbol(right)) {
        if (this.state.isPureSymbol(left) && !this.state.isWrapped(right)) {
          left.addType("binary", op, _typeof(right));
        } else if (!this.state.isWrapped(left) && this.state.isPureSymbol(right)) {
          right.addType("binary", op, _typeof(left));
        }
      }

      // Type Coercion
      if (this.state.isSymbolic(left) || this.state.isSymbolic(right)) {
        var res = (0, _typeCoercion.binaryTypeCoercion)(op, left, right);
        left = res.op1;
        right = res.op2;
      }

      // in operator for undefined property
      if (op === "in" && !this.state.isSymbolic(left) && !this.state.isSymbolic(right)) {
        if (right[left] === undefined && !(left in right) && !this._filterPath(this._location(iid).toString()) && !this._filterProp(left.toString())) {
          // if this.state.undefinedPool does not contain this offset, add it to the pool
          if (!this.state.undefinedPool.includes(left.toString())) {
            _log["default"].logUndefined("Found undefined property through in operator: " + left.toString() + " at " + this._location(iid).toString());
            this.state.undefinedPool.push(left.toString());
          }
        }
      }

      // Don't do symbolic logic if the symbolic values are diff types
      // Concretise instead
      if (this.state.isWrapped(left) || this.state.isWrapped(right)) {
        var left_c = this.state.getConcrete(left);
        var right_c = this.state.getConcrete(right);

        //We also consider boxed primitives to be primitive
        var is_primative = _typeof(left_c) != "object" || left_c instanceof Number || left_c instanceof String || left_c instanceof Boolean;
        var is_null = left_c === undefined || right_c === undefined || left_c === null || right_c === null;
        var is_real = typeof left_c == "number" ? Number.isFinite(left_c) && Number.isFinite(right_c) : true;

        //TODO: Work out how to check that boxed values are the same type
        var is_same_type = _typeof(left_c) === _typeof(right_c) || !is_null && left_c.valueOf() === right_c.valueOf();
        if (!is_same_type || !is_primative || is_null || !is_real) {
          _log["default"].log("Concretizing binary ".concat(op, " on operands of differing types. Type coercion not yet implemented symbolically. (").concat(_objectHelper["default"].asString(left_c), ", ").concat(_objectHelper["default"].asString(right_c), ") (").concat(_typeof(left_c), ", ").concat(_typeof(right_c), ")"));
          left = left_c;
          right = right_c;
        } else {}
      }

      // Don't evaluate natively when args are symbolic
      return {
        op: op,
        left: left,
        right: right,
        skip: this.state.isWrapped(left) || this.state.isWrapped(right)
      };
    }
  }, {
    key: "binary",
    value: function binary(iid, op, left, right, result_c, _isOpAssign, _isSwitchCaseComparison, _isComputed) {
      this.state.coverage.touch(iid);
      var result;
      if (this.state.isSymbolic(left) || this.state.isSymbolic(right)) {
        result = this.state.binary(op, left, right);
      } else {
        result = result_c;
      }
      return {
        result: result
      };
    }
  }, {
    key: "unaryPre",
    value: function unaryPre(iid, op, left) {
      // For the pure symbol
      if (this.state.isPureSymbol(left)) {
        left.addType("unary", op);
      }

      // Type Coercion
      if (this.state.isSymbolic(left)) {
        left = (0, _typeCoercion.unaryTypeCoercion)(op, left);
      }

      // Don't evaluate natively when args are symbolic
      return {
        op: op,
        left: left,
        skip: this.state.isWrapped(left)
      };
    }
  }, {
    key: "unary",
    value: function unary(iid, op, left, result_c) {
      this.state.coverage.touch(iid);
      return {
        result: this.state.unary(op, left)
      };
    }

    /**
     * This callback is called after a condition check before branching. Branching can happen in various statements
        * including if-then-else, switch-case, while, for, ||, &&, ?:.
     * 
     * Among them, the return value of if-then-else, switch-case, while, for is in boolean type.
     * The return value of || and && could be the value itself
     */
  }, {
    key: "conditional",
    value: function conditional(iid, result) {
      this.state.coverage.touch_cnd(iid, this.state.getConcrete(result));
      if (this.state.isSymbolic(result)) {
        this.state.conditional(this.state.toBool(result));
      }

      // To handle chained || and && operators
      // return J$.C(left): boolean, left: any type (including symbolic variable)
      return [{
        result: this.state.getConcrete(result)
      }, result];
    }
  }, {
    key: "instrumentCodePre",
    value: function instrumentCodePre(iid, code) {
      return {
        code: code,
        skip: false
      };
    }
  }, {
    key: "instrumentCode",
    value: function instrumentCode(iid, code, _newAst) {
      return {
        result: code
      };
    }

    /*runInstrumentedFunctionBody(iid) {}*/
  }, {
    key: "onReady",
    value: function onReady(cb) {
      cb();
    }
  }]);
}();
var _default = exports["default"] = SymbolicExecution;