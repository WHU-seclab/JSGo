"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _log = _interopRequireDefault(require("./utilities/log"));
var _objectHelper = _interopRequireDefault(require("./utilities/object-helper"));
var _coverage = _interopRequireDefault(require("./coverage"));
var _config = _interopRequireDefault(require("./config"));
var _symbolicHelper = _interopRequireDefault(require("./symbolic-helper"));
var _symbolicObject = require("./values/symbolic-object");
var _pureSymbol = require("./values/pure-symbol");
var _wrappedValues = require("./values/wrapped-values");
var _safeJson = require("./utilities/safe-json");
var _main = _interopRequireDefault(require("../../lib/Stats/bin/main"));
var _z3javascript = _interopRequireDefault(require("z3javascript"));
var _helpers = _interopRequireDefault(require("./models/helpers"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */ // JALANGI DO NOT INSTRUMENT
function BuildUnaryJumpTable(state) {
  var ctx = state.ctx;
  return {
    "boolean": {
      "+": function _(val_s) {
        return ctx.mkIte(val_s, state.constantSymbol(1), state.constantSymbol(0));
      },
      "-": function _(val_s) {
        return ctx.mkIte(val_s, state.constantSymbol(-1), state.constantSymbol(0));
      },
      "!": function _(val_s) {
        return ctx.mkNot(val_s);
      }
    },
    "number": {
      "!": function _(val_s, val_c) {
        var bool_s = state.asSymbolic(state.toBool(new _wrappedValues.ConcolicValue(val_c, val_s)));
        return bool_s ? ctx.mkNot(bool_s) : undefined;
      },
      "+": function _(val_s) {
        return val_s;
      },
      "-": function _(val_s) {
        return ctx.mkUnaryMinus(val_s);
      }
    },
    "string": {
      "!": function _(val_s, val_c) {
        var bool_s = state.asSymbolic(state.toBool(new _wrappedValues.ConcolicValue(val_c, val_s)));
        return bool_s ? ctx.mkNot(bool_s) : undefined;
      },
      "+": function _(val_s) {
        return ctx.mkStrToInt(val_s);
      },
      "-": function _(val_s) {
        return ctx.mkUnaryMinus(ctx.mkStrToInt(val_s));
      }
    }
  };
}
var SymbolicState = /*#__PURE__*/function () {
  function SymbolicState(input, undefinedUnderTest, inherit, sandbox) {
    _classCallCheck(this, SymbolicState);
    this.ctx = new _z3javascript["default"].Context();
    this.slv = new _z3javascript["default"].Solver(this.ctx, _config["default"].incrementalSolverEnabled, [{
      name: "smt.string_solver",
      value: _config["default"].stringSolver
    },
    //				{ name: "timeout", value: Config.maxSolverTime },
    {
      name: "random_seed",
      value: Math.floor(Math.random() * Math.pow(2, 32))
    }, {
      name: "phase_selection",
      value: 5
    }]);
    this.helpers = new _helpers["default"](this, this.ctx);
    _z3javascript["default"].Query.MAX_REFINEMENTS = _config["default"].maxRefinements;
    this.MAX_PC_LENGTH = 30;
    this.input = input;
    this.inputSymbols = {}; /** symbols passing to the sovler, not including pureSymbol and symbolicObject, */
    this.wrapperSymbols = {}; /** pureSymbol and symbolicObject */
    this.pathCondition = [];
    this.parallelid = 0; /** indicate path constraints that are parallel should be 
                         view as one constraint in bound computation.
                         e.g. this[concolicVar], then we may add constraints for all the property name to the var. these constraints are paralleled.
                         */
    this.undefinedPool = inherit.undefinedPool; /** current undefined pool */

    this.stats = new _main["default"]();
    this.result = false; /** found the gadget or not */
    this.coverage = new _coverage["default"](sandbox);
    this.errors = [];

    /** Helper Properties */
    this.withHelper = inherit.withHelper; /** whether use helper properties */
    this.retHelper = false; /** whether retrun the helper candidates */
    this.hasLoaded = false; /** whether the polluted variable has been visited */
    this.helperCandidates = []; /** patching undefined property candidates */

    /** Sandbox for Prototype */
    this.saved_prototype = {};

    /** for...in Properties load */
    this.forinIndex = 0; /** used for forin key naming */
    this.forinLoad = inherit.forinLoad || false; /** whether create symbolic key and value when encounter for loop*/
    this.symbolicKey = {}; /** save the created symbolic key */
    this.forinKeys = inherit.forinKeys || []; /** help to initial the found/identified forin key, saved for next round*/
    this.forinKeyBound = inherit.forinKeyBound || 0;
    this._unaryJumpTable = BuildUnaryJumpTable(this);
    this._setupSmtFunctions();
    this.undefinedUnderTest = undefinedUnderTest;
  }

  /**
   * we assme the input of the for...in loaded property has the following items
   * this.input:{
   * 	forin_{id}_key_undef_t: "string",
   * 	forin_{id}_key_undef: "somekey",
   * 	forin_{id}_undef_t: "atype",
   * 	forin_{id}_undef: "someval"
   * }
   * 
   * =>
   * set forin_{id}_key_undef_t = "string" 
   * 
   * if somekey == "":
   * 		// means we didn't find the constraints for the key, so we keep the key as it is and try again
   * 		somekey = "forin_{id}",
   * 		this.input: {
   * 			forin_{id}_key_undef_t: "string",
   * 			forin_{id}_key_undef: "somekey",
   * 			somekey_undef_t: "atype",
   * 			somekey_undef: "someval"
   * 		},
   * 		this.symbolicKey[`${somekey}`] = createPureSymbol(`${somekey}_key_undef`),
   * 		Object.prototype[`${somekey}`] = createPureSymbol(`${somekey}_undef`)
   * 		this.state.forinLoad = false
   * 
   * else:
   * 		// if we found a concrete key name, then we will use the keyname to pollute the root prototype directly
   * 		// we will remove the symbolic key as we no longer need it
   *		this.input: {
   * 			forin_{id}_key_undef_t: "string",
   * 			forin_{id}_key_undef: "somekey",
   * 			somekey_undef_t: "atype",
   * 			somekey_undef: "someval",
   * 			_bound: this.input._bound-2
   * 		}
   * 
   * 		Object.prototype[`${somekey}`] = createPureSymbol(`${somekey}_undef`)
   * 		this.state.forinLoad = false
   * 		;
   * 
   */
  return _createClass(SymbolicState, [{
    key: "_setupForinKeyVal",
    value: function _setupForinKeyVal() {
      // Loop over all properties of this.input
      for (var key in this.input) {
        // Check if key matches the "forin_{id}_key_undef" pattern
        if (/^forin_\d+_key_undef$/.test(key)) {
          // Extract ID from the key
          var id = key.split("_")[1];
          var somekey = this.input[key];

          // Correct the key type to string
          this.input["".concat(key, "_t")] = "string";

          // Modify key if there are no constraints
          if (somekey === "") {
            somekey = "forin_".concat(id);
            this.input[key] = somekey;
          } else {
            // Modify key and value based on the existing constraints
            var existingTypeKey = "forin_".concat(id, "_undef_t");
            var newTypeKey = "".concat(somekey, "_undef_t");
            this.input[newTypeKey] = this.input[existingTypeKey];
            delete this.input[existingTypeKey];
            var existingValKey = "forin_".concat(id, "_undef");
            var newValKey = "".concat(somekey, "_undef");
            if (this.input[existingValKey]) {
              this.input[newValKey] = this.input[existingValKey];
              delete this.input[existingValKey];
            }
            /**
             * here we need to remove all the contraints in the _bound for the symbolic key
             * usually the number is 2, but there might be more
             */
            this.input._bound -= this.forinKeyBound;
            this.forinKeys.push(somekey);
          }
          if (somekey === "forin_".concat(id)) {
            this.symbolicKey["".concat(somekey)] = this.createPureSymbol("".concat(somekey, "_key_undef"));
          }
          Object.prototype["".concat(somekey)] = this.createPureSymbol("".concat(somekey, "_undef"));

          // Update the state
          this.forinLoad = false;
        }
      }
    }
  }, {
    key: "setupUndefined",
    value: function setupUndefined(propName, propValue) {
      /**
       * Even though getter helps us to track the first access of the property
       * but it will cause the unexpected behavior of the property in its decentants
       * since getter will also be inherited
       * 
       * if propName='line', propValue=1
       * {}.line = 0 // will not assign new property named 'line' to {}
       * Object.prototype.line = 0
       */
      // Object.defineProperty(Object.prototype, propName, {
      // 	get() {
      // 		Log.log(`${propName} has been visited for the first time`);
      // 		global.J$.analysis.state.hasLoaded = true;

      // 		// After first access, replace getter with simple value
      // 		Object.defineProperty(Object.prototype, propName, {
      // 			value: propValue,
      // 			writable: true,
      // 			configurable: true,
      // 			enumerable: true
      // 		});

      // 		// Return the new value
      // 		return this[propName];
      // 	},
      // 	set(value) {
      // 		propValue = value;
      // 	},
      // 	configurable: true,
      // 	enumerable: true
      // });
      Object.prototype[propName] = propValue;
      if (!this.undefinedUnderTest.includes(propName)) {
        this.undefinedPool.push(propName);
      }
    }
  }, {
    key: "_setupUndefinedUT",
    value: function _setupUndefinedUT() {
      // pollute the prototype
      // Object.prototype[this.undefinedUnderTest[i]] = this.createPureSymbol(this.undefinedUnderTest[i]+"_undef");
      for (var i = 0; i < this.undefinedUnderTest.length; i++) {
        var propName = this.undefinedUnderTest[i];

        // set helper property value to the fixed "true"
        if (this.withHelper && propName === this.withHelper) {
          Object.prototype[propName] = "true";
        } else {
          var propValue = this.createPureSymbol(propName + "_undef");
          this.setupUndefined(propName, propValue);
        }
      }
      if (this.forinKeys.length > 0) {
        for (var _i = 0; _i < this.forinKeys.length; _i++) {
          var _propName = this.forinKeys[_i];
          var _propValue = this.createPureSymbol(_propName + "_undef");
          this.setupUndefined(_propName, _propValue);
        }
      }
      this._setupForinKeyVal();
    }

    /** Set up a bunch of SMT functions used by the models **/
  }, {
    key: "_setupSmtFunctions",
    value: function _setupSmtFunctions() {
      this.stringRepeat = this.ctx.mkRecFunc(this.ctx.mkStringSymbol("str.repeat"), [this.ctx.mkStringSort(), this.ctx.mkIntSort()], this.ctx.mkStringSort());
      this.slv.fromString("(define-fun-rec str.repeat ((a String) (b Int)) String (if (<= b 0) \"\" (str.++ a (str.repeat a (- b 1)))))");
      this.whiteLeft = this.ctx.mkRecFunc(this.ctx.mkStringSymbol("str.whiteLeft"), [this.ctx.mkStringSort(), this.ctx.mkIntSort()], this.ctx.mkIntSort());
      this.whiteRight = this.ctx.mkRecFunc(this.ctx.mkStringSymbol("str.whiteRight"), [this.ctx.mkStringSort(), this.ctx.mkIntSort()], this.ctx.mkIntSort());

      /** Set up trim methods **/
      this.slv.fromString("(define-fun str.isWhite ((c String)) Bool (= c \" \"))\n" +
      //TODO: Only handles  
      "(define-fun-rec str.whiteLeft ((s String) (i Int)) Int (if (str.isWhite (str.at s i)) (str.whiteLeft s (+ i 1)) i))\n" + "(define-fun-rec str.whiteRight ((s String) (i Int)) Int (if (str.isWhite (str.at s i)) (str.whiteRight s (- i 1)) i))\n");
    }
  }, {
    key: "pushCondition",
    value: function pushCondition(cnd, binder) {
      this.pathCondition.push({
        ast: cnd,
        binder: binder || false,
        forkIid: this.coverage.last()
      });
    }
  }, {
    key: "conditional",
    value: function conditional(result) {
      var result_c = this.getConcrete(result),
        result_s = this.asSymbolic(result);
      if (result_c === true) {
        this.pushCondition(result_s);
      } else if (result_c === false) {
        this.pushCondition(this.ctx.mkNot(result_s));
      } else {
        _log["default"].log("WARNING: Symbolic Conditional on non-bool, concretizing");
      }
      return result_c;
    }

    /**
      * Creates a full (up to date) solver instance and then calls toString on it to create an SMT2Lib problem
      * TODO: This is a stop-gag implementation for the work with Ronny - not to be relied upon.
      */
  }, {
    key: "inlineToSMTLib",
    value: function inlineToSMTLib() {
      var _this = this;
      this.slv.push();
      this.pathCondition.forEach(function (pcItem) {
        return _this.slv.assert(pcItem.ast);
      });
      var resultString = this.slv.toString();
      this.slv.pop();
      return resultString;
    }

    /**
       * Returns the final PC as a string (if any symbols exist)
       */
  }, {
    key: "finalPC",
    value: function finalPC() {
      return this.pathCondition.filter(function (x) {
        return x.ast;
      }).map(function (x) {
        return x.ast;
      });
    }
  }, {
    key: "_stringPC",
    value: function _stringPC(pc) {
      return pc.length ? pc.reduce(function (prev, current) {
        var this_line = current.simplify().toPrettyString().replace(/\s+/g, " ").replace(/not /g, "¬");
        if (this_line.startsWith("(¬")) {
          this_line = this_line.substr(1, this_line.length - 2);
        }
        if (this_line == "true" || this_line == "false") {
          return prev;
        } else {
          return prev + (prev.length ? ", " : "") + this_line;
        }
      }, "") : "";
    }

    /**
     * Count the number of parallel path constraints before pcIndex
     * 
     * 
     * @param {*} pc 
     */
  }, {
    key: "_removeParallelPC",
    value: function _removeParallelPC(pcIndex) {
      var countMap = {};
      for (var i = 0; i <= pcIndex; i++) {
        if (this.pathCondition[i].parallelid !== -1) {
          if (countMap[this.pathCondition[i].parallelid]) {
            countMap[this.pathCondition[i].parallelid]++;
          } else {
            countMap[this.pathCondition[i].parallelid] = 1;
          }
        }
      }
      return pcIndex + 1 + Object.keys(countMap).length - Object.values(countMap).reduce(function (acc, value) {
        return acc + value;
      }, 0);
    }
  }, {
    key: "_addInput",
    value: function _addInput(pc, solution, pcIndex, childInputs) {
      // solution._bound = this._removeParallelPC(pcIndex);
      solution._bound = pcIndex + 1;
      childInputs.push({
        input: solution,
        pc: this._stringPC(pc),
        forkIid: this.pathCondition[pcIndex].forkIid
      });
    }
  }, {
    key: "_solvePC",
    value: function _solvePC(childInputs, i, inputCallback) {
      var mkNot = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var newPC = this.pathCondition[i].ast;
      if (mkNot) {
        newPC = this.ctx.mkNot(newPC);
      }
      var allChecks = this.pathCondition.slice(0, i).reduce(function (last, next) {
        return last.concat(next.ast.checks);
      }, []).concat(newPC.checks);
      var solution = this._checkSat(newPC, i, allChecks);
      if (solution) {
        this._addInput(newPC, solution, i, childInputs);
        if (inputCallback) {
          inputCallback(childInputs);
        }
      } else {}
    }
  }, {
    key: "_buildAsserts",
    value: function _buildAsserts(i) {
      return this.pathCondition.slice(0, i).map(function (x) {
        return x.ast;
      });
    }

    /**
     * Solve the current PC and get the alternative inputs for the next round
     * 
     * __bound: the upper bound of the current PC
     * Only mkNot the PC after __bound and assume the pc before __bound always holds true
     * 
     * @param {*} inputCallback 
     */
  }, {
    key: "alternatives",
    value: function alternatives(inputCallback) {
      var _this2 = this;
      var childInputs = [];
      if (this.input._bound > this.pathCondition.length) {
        // Log.log(`${JSON.stringify(this.input)}`);
        throw "Bound ".concat(this.input._bound, " > ").concat(this.pathCondition.length, ", divergence has occured");
      }

      // Path conditions before _bound should always holds true
      this._buildAsserts(Math.min(this.input._bound, this.pathCondition.length)).forEach(function (x) {
        return _this2.slv.assert(x);
      });
      this.slv.push();
      for (var i = this.input._bound; i < this.pathCondition.length; i++) {
        //TODO: Make checks on expressions smarter
        if (!this.pathCondition[i].binder) {
          this._solvePC(childInputs, i, inputCallback);
        }
        //Push the current thing we're looking at to the solver
        this.slv.assert(this.pathCondition[i].ast);
        this.slv.push();
        if (i > this.MAX_PC_LENGTH) {
          break;
        }
      }

      /** jackfromeast
       * 
       * if bound > pathCondition.length, meaning there is error in the program
       * if bound < pathCondition.length, meaning there are newly discovered path condition, and we already add them to the childInputs
       * if bound == pathCondition.length, meaning there is no newly discovered path condition
       * 
       * but if there are newly discovered pure symbol, we should add them to the childInputs and explore the next round
       * 
       * update: replaced childInputs.length==0 lol
       */
      if (this.pathCondition.length > 0 && childInputs.length == 0 && this._getPureSymbolNum()) {
        // solve the exisiting path condition(before the _bound)
        this._solvePC(childInputs, this.input._bound - 1, inputCallback, false);
      }

      // solve done
      this.slv.reset();

      /**
       * calculate the number of constraints in bounds related to the symbolic key 
       */
      if (this.forinLoad && childInputs.length) {
        for (var _i2 = 0; _i2 < childInputs.length; _i2++) {
          childInputs[_i2].forinKeyBound = this._getForinKeyBound(childInputs[_i2].input);
        }
      }

      /** jackfromeast
       * For each pure symbol, summarize it
       * Instead of pushing the constraints to the solver and get the pure symbol's type,
       * We add them directly to the childInputs
       * 
       * If we have more than one pure symbol, we will make the combination of the pure symbols and add them to the childInputs
       */
      if (this._getPureSymbolNum()) {
        var pureSymbolTypes = this.summaryPureSymbol();
        var childInputsWithTypes = [];
        if (childInputs.length == 0) {
          for (var _i3 = 0; _i3 < pureSymbolTypes.length; _i3++) {
            childInputsWithTypes.push({
              input: Object.assign(pureSymbolTypes[_i3], {
                _bound: Object.keys(pureSymbolTypes[_i3]).length
              }),
              pc: "",
              forkIid: this.coverage.last()
            });
          }
        } else {
          for (var _i4 = 0; _i4 < childInputs.length; _i4++) {
            for (var j = 0; j < pureSymbolTypes.length; j++) {
              var newItem = Object.assign({}, childInputs[_i4]);
              newItem.input = Object.assign({}, childInputs[_i4].input, pureSymbolTypes[j]);
              newItem.input._bound += this._getPureSymbolNum();
              childInputsWithTypes.push(newItem);
            }
          }
        }
        childInputs = childInputsWithTypes;
      }

      // add inherited info to the childInputs
      for (var _i5 = 0; _i5 < childInputs.length; _i5++) {
        childInputs[_i5].forinLoad = this.forinLoad;
        childInputs[_i5].forinKeys = this.forinKeys;
      }

      //Guarentee inputCallback is called at least once
      inputCallback(childInputs);
    }

    /**
     * calculate the number of constraints in bounds related to the symbolic key
     * e.g. 
     * 		pc: "(= forin_0_key_undef_t \"string\"),(not (= forin_0_key_undef \"hiddenKey\")),(not (= forin_0_key_undef \"hiddenKey2\"))"
     * 		and _bound = 3,
     * 		then retrun 3
     * 
     * @param {*} input 
     */
  }, {
    key: "_getForinKeyBound",
    value: function _getForinKeyBound(input) {
      var count = 0;
      for (var i = 0; i < input._bound; i++) {
        // since we only support one symbolic key
        if (this.pathCondition[i].ast.toString().includes("forin_0_key_undef")) {
          count++;
        }
      }
      return count;
    }

    /**
     * get the current pure symbol's num
     */
  }, {
    key: "_getPureSymbolNum",
    value: function _getPureSymbolNum() {
      var num = 0;
      for (var _i6 = 0, _Object$values = Object.values(this.wrapperSymbols); _i6 < _Object$values.length; _i6++) {
        var symbol = _Object$values[_i6];
        if (this.isPureSymbol(symbol)) {
          num++;
        }
      }
      return num;
    }

    /** jackfromeast
     * @param {*} concrete: the concrete value to be converted to a symbolic value
     * @returns sort: the sort of the symbolic value
     */
  }, {
    key: "_getSort",
    value: function _getSort(concrete) {
      var sort;
      switch (_typeof(concrete)) {
        case "boolean":
          sort = this.ctx.mkBoolSort();
          break;
        case "number":
          sort = this.ctx.mkRealSort();
          break;
        case "string":
          sort = this.ctx.mkStringSort();
          break;
        default:
          _log["default"].log("Symbolic input variable of type ".concat(typeof val === "undefined" ? "undefined" : _typeof(val), " not yet supported."));
      }
      return sort;
    }
  }, {
    key: "_deepConcrete",
    value: function _deepConcrete(start, _concreteCount) {
      start = this.getConcrete(start);
      /*
      let worklist = [this.getConcrete(start)];
      let seen = [];
      	while (worklist.length) {
      	const arg = worklist.pop();
      	seen.push(arg);
      		for (let i in arg) {
      		if (this.isSymbolic(arg[i])) {
      			arg[i] = this.getConcrete(arg[i]);
      			concreteCount.val += 1;
      		}
      			const seenBefore = !!seen.find(x => x === arg); 
      		if (arg[i] instanceof Object && !seenBefore) {
      			worklist.push(arg[i]); 
      		}
      	}
      }
        	*/
      return start;
    }

    // jackfromeast
    // used for making the input argument of a function concrete
  }, {
    key: "concretizeCall",
    value: function concretizeCall(f, base, args) {
      var report = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var numConcretizedProperties = {
        val: 0
      };
      base = this._deepConcrete(base, numConcretizedProperties);
      var n_args = Array(args.length);
      for (var i = 0; i < args.length; i++) {
        n_args[i] = this._deepConcrete(args[i], numConcretizedProperties);
      }
      if (report && numConcretizedProperties.val) {
        this.stats.set("Concretized Function Calls", f.name);
      }
      return {
        base: base,
        args: n_args,
        count: numConcretizedProperties.val
      };
    }

    /** jackfromeast
     * 
     * when we create an pure symbol, what we are trying to say is that the type/sort of the value is undecidable yet
     * in ExpoSE, they try to mkNot of all the others types and test them one by one
     * in ExpoSE+, we try to determine the type of the value in the first round, add the possible type constraints and only check these types in the following rounds
     * 
     * @param {string} name 
     * @returns symbolic value
     */
  }, {
    key: "createPureSymbol",
    value: function createPureSymbol(name) {
      this.stats.seen("Pure Symbols");

      // if it is not the first round, pureType would contains an concrete type e.g. strings
      var pureType = this.createSymbolicValueType(name + "_t", "unknown");
      if (pureType.getConcrete() !== "unknown") {
        // in the following rounds,
        switch (pureType.getConcrete()) {
          case "string":
            this.assertEqual(pureType, this.concolic("string")); // add the first type constraint
            return this.createSymbolicValue(name, "seed_string");
          case "number":
            this.assertEqual(pureType, this.concolic("number"));
            return this.createSymbolicValue(name, 0);
          case "boolean":
            this.assertEqual(pureType, this.concolic("boolean"));
            return this.createSymbolicValue(name, false);
          case "object":
            {
              this.assertEqual(pureType, this.concolic("object"));
              var symbolObj = this.createSymbolicValue(name, {});

              // set symbolic variables for found elements of the current object in the Inputs
              for (var _i7 = 0, _Object$keys = Object.keys(this.input); _i7 < _Object$keys.length; _i7++) {
                var key = _Object$keys[_i7];
                var reg = new RegExp("^".concat(name, "_elements_(\\w+)_t$"));
                if (reg.test(key)) {
                  var element_name = reg.exec(key)[1];
                  var element_symbol = this.createPureSymbol("".concat(name, "_elements_").concat(element_name));
                  if (element_symbol !== undefined) {
                    symbolObj.setField(this, element_name, element_symbol);
                  }
                }
              }
              return symbolObj;
            }
          case "array_number":
            this.assertEqual(pureType, this.concolic("array_number"));
            return this.createSymbolicValue(name, [0]);
          case "array_string":
            this.assertEqual(pureType, this.concolic("array_string"));
            return this.createSymbolicValue(name, ["seed_string"]);
          case "array_bool":
            this.assertEqual(pureType, this.concolic("array_bool"));
            return this.createSymbolicValue(name, [false]);
          case "null":
            return null;
          /**
           * meaning the symbolic value are set to undefined on purpose
           * in the following round, this field will always be set to undefine which is intended
           * other types will be explored from other partent branches
           */
          case "undefined":
            this.assertEqual(pureType, this.concolic("undefined"));
            return undefined;
          default:
            _log["default"].log("Symbolic input variable of type ".concat(typeof val === "undefined" ? "undefined" : _typeof(val), " not yet supported."));
        }
      } else {
        // in the first round, we create a real pure symbol
        var res = new _pureSymbol.PureSymbol(name);
        this.wrapperSymbols[name] = res;
        res.setPureType(pureType);
        return res;
      }
    }

    /**
     * generate possible combination of pure symbols's possible types
     * we donot push these type constraints to the PC directly
     * 
     * add undefined types if pure symbol > 2
     * this makes we can test the scenario that only one/a few of them appears in a single round
     * 
     * @returns [{pureSymbol1_t: 'String', pureSymbol2_t: 'Number'}, {...}]
     */
  }, {
    key: "summaryPureSymbol",
    value: function summaryPureSymbol() {
      var possibleTypes = {};
      for (var _i8 = 0, _Object$values2 = Object.values(this.wrapperSymbols); _i8 < _Object$values2.length; _i8++) {
        var symbol = _Object$values2[_i8];
        if (this.isPureSymbol(symbol)) {
          possibleTypes[symbol.getName() + "_t"] = symbol.getPossibleTypes();
        }
      }
      if (Object.keys(possibleTypes).length > 1) {
        for (var _i9 = 0, _Object$keys2 = Object.keys(possibleTypes); _i9 < _Object$keys2.length; _i9++) {
          var key = _Object$keys2[_i9];
          possibleTypes[key].push("undefined");
        }
      }
      var _generateCombinations = function generateCombinations(obj) {
        var keys = Object.keys(obj);
        if (!keys.length) return [{}];
        var result = [];
        var rest = _generateCombinations(Object.fromEntries(Object.entries(obj).slice(1)));
        var _iterator = _createForOfIteratorHelper(obj[keys[0]]),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _val = _step.value;
            var _iterator2 = _createForOfIteratorHelper(rest),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var comb = _step2.value;
                // result.push({ [keys[0]]: val, ...comb }); donot support ... syntax
                var newObj = Object.assign({}, comb);
                newObj[keys[0]] = _val;
                result.push(newObj);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return result;
      };
      return _generateCombinations(possibleTypes);
    }

    /**
     * This function is used to create the symbol for symbolic variable's types.
     * @param {*} name 
     * @param {*} type 
     * @returns 
     */
  }, {
    key: "createSymbolicValueType",
    value: function createSymbolicValueType(name, type) {
      var symbolic;
      var arrayType;

      // Use generated input if available
      if (name in this.input && this._typeCheck(name)) {
        type = this.input[name];
      } else {
        this.input[name] = type;
      }

      // if the concrete value is undefined, meaning it is a pure symbol, it shouldn't appear in the PC of this round
      this.stats.seen("Symbolic Primitives");
      var sort = this._getSort("astring");
      var symbol = this.ctx.mkStringSymbol(name);
      symbolic = this.ctx.mkConst(symbol, sort);

      // if the concrete value is unknown, meaning it is a pure symbol, it shouldn't appear in the PC of this round
      // we assume that all the symbolic values with "unknown" concrete value are pure symbols
      if (type !== "unknown") {
        this.inputSymbols[name] = symbolic;
      }
      return new _wrappedValues.ConcolicValue(type, symbolic, arrayType);
    }

    /**
     * Assigning symbolic values to input variables
     * 
     * @param {*} name 
     * @param {*} concrete 
     * @returns 
     */
  }, {
    key: "createSymbolicValue",
    value: function createSymbolicValue(name, concrete) {
      this.stats.seen("Symbolic Values");

      //TODO: Very ugly short circuit
      if (!(concrete instanceof Array) && _typeof(concrete) === "object") {
        this.wrapperSymbols[name] = new _symbolicObject.SymbolicObject(name);
        return this.wrapperSymbols[name];
      }
      var symbolic;
      var arrayType;

      // Use generated input if available
      if (name in this.input && this._typeCheck(name)) {
        concrete = this.input[name];
      } else {
        this.input[name] = concrete;
      }
      if (concrete instanceof Array) {
        this.stats.seen("Symbolic Arrays");
        symbolic = this.ctx.mkArray(name, this._getSort(concrete[0]));
        this.pushCondition(this.ctx.mkGe(symbolic.getLength(), this.ctx.mkIntVal(0)), true);
        arrayType = _typeof(concrete[0]);
      } else {
        // if the concrete value is undefined, meaning it is a pure symbol, it should appear in the PC of this round
        this.stats.seen("Symbolic Primitives");
        var sort = this._getSort(concrete);
        var symbol = this.ctx.mkStringSymbol(name);
        symbolic = this.ctx.mkConst(symbol, sort);
      }
      this.inputSymbols[name] = symbolic;
      return new _wrappedValues.ConcolicValue(concrete, symbolic, arrayType);
    }
  }, {
    key: "_typeCheck",
    value: function _typeCheck(name) {
      if (name.endsWith("_t") && !["string", "boolean", "number", "object", "array_number", "array_string", "array_bool", "undefined"].includes(this.input[name])) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: "getSolution",
    value: function getSolution(model) {
      var solution = {};
      for (var _i10 = 0, _Object$keys3 = Object.keys(this.inputSymbols); _i10 < _Object$keys3.length; _i10++) {
        var name = _Object$keys3[_i10];
        // for (let name in this.inputSymbols) {
        var solutionAst = model.eval(this.inputSymbols[name]);
        solution[name] = solutionAst.asConstant(model);
        solutionAst.destroy();
      }
      model.destroy();
      return solution;
    }
  }, {
    key: "_checkSat",
    value: function _checkSat(clause, i, checks) {
      var startTime = new Date().getTime();
      var model = new _z3javascript["default"].Query([clause], checks).getModel(this.slv);
      var endTime = new Date().getTime();
      this.stats.max("Max Queries (Any)", _z3javascript["default"].Query.LAST_ATTEMPTS);
      if (model) {
        this.stats.max("Max Queries (Succesful)", _z3javascript["default"].Query.LAST_ATTEMPTS);
      } else {
        this.stats.seen("Failed Queries");
        if (_z3javascript["default"].Query.LAST_ATTEMPTS == _z3javascript["default"].Query.MAX_REFINEMENTS) {
          this.stats.seen("Failed Queries (Max Refinements)");
        }
      }
      _log["default"].logQuery(clause.toString(), this.slv.toString(), checks.length, startTime, endTime, model ? model.toString() : undefined, _z3javascript["default"].Query.LAST_ATTEMPTS, _z3javascript["default"].Query.LAST_ATTEMPTS == _z3javascript["default"].Query.MAX_REFINEMENTS);
      return model ? this.getSolution(model) : undefined;
    }
  }, {
    key: "isWrapped",
    value: function isWrapped(val) {
      return val instanceof _wrappedValues.WrappedValue;
    }
  }, {
    key: "isSymbolic",
    value: function isSymbolic(val) {
      return !!_wrappedValues.ConcolicValue.getSymbolic(val);
    }

    /** jackfromeast
     * To avoid Maximum call stack size exceeded error, we only check the first level of the object
     * @param {*} val : could be ConcolicValue; object or array that has concolic value inside; normal value
     * @returns 
     */
  }, {
    key: "isSymbolicDeep",
    value: function isSymbolicDeep(val) {
      // Firstly check if the value is symbolic
      if (this.isSymbolic(val)) {
        return true;
      }
      // The val is not symbolic directly, could be an object or an array that contains symbolic value
      else {
        // not a object or an array, return false
        if (_typeof(val) !== "object" || val === null) {
          return false;
        } else {
          // Get the value's own property names
          var keys = Object.keys(val);

          // Loop over each property in the value
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var descriptor = Object.getOwnPropertyDescriptor(val, prop);

            // If the property is not a getter, check if it's symbolic
            if (!(descriptor && descriptor.get)) {
              if (this.isSymbolic(val[prop])) {
                return true;
              }
            }
          }
          return false;
        }
      }
    }

    /** jackfromeast
     * check if the symbol is a pure symbol
     */
  }, {
    key: "isPureSymbol",
    value: function isPureSymbol(symbol) {
      return symbol instanceof _pureSymbol.PureSymbol;
    }
  }, {
    key: "updateSymbolic",
    value: function updateSymbolic(val, val_s) {
      return _wrappedValues.ConcolicValue.setSymbolic(val, val_s);
    }
  }, {
    key: "getConcrete",
    value: function getConcrete(val) {
      return val instanceof _wrappedValues.WrappedValue ? val.getConcrete() : val;
    }
  }, {
    key: "arrayType",
    value: function arrayType(val) {
      return val instanceof _wrappedValues.WrappedValue ? val.getArrayType() : undefined;
    }
  }, {
    key: "getSymbolic",
    value: function getSymbolic(val) {
      return _wrappedValues.ConcolicValue.getSymbolic(val);
    }
  }, {
    key: "asSymbolic",
    value: function asSymbolic(val) {
      return _wrappedValues.ConcolicValue.getSymbolic(val) || this.constantSymbol(val);
    }
  }, {
    key: "_symbolicBinary",
    value: function _symbolicBinary(op, left_c, left_s, right_c, right_s) {
      this.stats.seen("Symbolic Binary");
      // restore the root prototype when entering the Z3's world
      this.savePrototype();
      var ret = undefined;
      switch (op) {
        case "===":
        case "==":
          ret = this.ctx.mkEq(left_s, right_s);
          break;
        case "!==":
        case "!=":
          ret = this.ctx.mkNot(this.ctx.mkEq(left_s, right_s));
          break;
        case "&&":
          ret = this.ctx.mkAnd(left_s, right_s);
          break;
        case "||":
          ret = this.ctx.mkOr(left_s, right_s);
          break;
        case ">":
          ret = this.ctx.mkGt(left_s, right_s);
          break;
        case ">=":
          ret = this.ctx.mkGe(left_s, right_s);
          break;
        case "<=":
          ret = this.ctx.mkLe(left_s, right_s);
          break;
        case "<":
          ret = this.ctx.mkLt(left_s, right_s);
          break;
        case "<<":
        case "<<<":
          left_s = this.ctx.mkRealToInt(left_s);
          right_s = this.ctx.mkRealToInt(right_s);
          ret = this.ctx.mkIntToReal(this.ctx.mkMul(left_s, this.ctx.mkPower(this.ctx.mkIntVal(2), right_s)));
          break;
        case ">>":
        case ">>>":
          left_s = this.ctx.mkRealToInt(left_s);
          right_s = this.ctx.mkRealToInt(right_s);
          ret = this.ctx.mkIntToReal(this.ctx.mkDiv(left_s, this.ctx.mkPower(this.ctx.mkIntVal(2), right_s)));
          break;
        case "+":
          ret = typeof left_c === "string" ? this.ctx.mkSeqConcat([left_s, right_s]) : this.ctx.mkAdd(left_s, right_s);
          break;
        case "-":
          ret = this.ctx.mkSub(left_s, right_s);
          break;
        case "*":
          ret = this.ctx.mkMul(left_s, right_s);
          break;
        case "/":
          ret = this.ctx.mkDiv(left_s, right_s);
          break;
        case "%":
          ret = this.ctx.mkMod(left_s, right_s);
          break;
        default:
          _log["default"].log("Symbolic execution does not support operand ".concat(op, ", concretizing."));
          break;
      }
      this.restorePrototype();
      return ret;
    }

    /** 
      	* Symbolic binary operation, expects at least one values and an operator
      	*/
  }, {
    key: "binary",
    value: function binary(op, left, right) {
      // jackfromeast
      left = this.concolic(left);
      right = this.concolic(right);
      if (typeof this.getConcrete(left) === "string") {
        right = this.ToString(right);
      }
      var result_c = _symbolicHelper["default"].evalBinary(op, this.getConcrete(left), this.getConcrete(right));
      var result_s = this._symbolicBinary(op, this.getConcrete(left), this.asSymbolic(left), this.getConcrete(right), this.asSymbolic(right));
      return _typeof(result_s) !== undefined ? new _wrappedValues.ConcolicValue(result_c, result_s) : result_c;
    }

    /** jackfromeast
     * What does this mean?
     * Symbolic field lookup - currently only has support for symbolic arrays / strings
      	*/
  }, {
    key: "symbolicField",
    value: function symbolicField(base_c, base_s, field_c, field_s) {
      this.stats.seen("Symbolic Field");
      this.savePrototype();
      function canHaveFields() {
        return typeof base_c === "string" || base_c instanceof Array;
      }
      function isRealNumber() {
        return typeof field_c === "number" && Number.isFinite(field_c);
      }
      if (canHaveFields() && isRealNumber()) {
        var withinBounds = this.ctx.mkAnd(this.ctx.mkGt(field_s, this.ctx.mkIntVal(-1)), this.ctx.mkLt(field_s, base_s.getLength()));
        var res = undefined;
        if (this.conditional(new _wrappedValues.ConcolicValue(field_c > -1 && field_c < base_c.length, withinBounds))) {
          res = base_s.getField(this.ctx.mkRealToInt(field_s));
        }
        this.restorePrototype();
        return res;
      }
      switch (field_c) {
        case "length":
          {
            if (base_s.getLength()) {
              this.restorePrototype();
              return base_s.getLength();
            } else {
              _log["default"].log("No length field on symbolic value");
            }
            break;
          }
        default:
          {
            // Log.log("Unsupported symbolic field - concretizing " + base_c + " and field " + field_c);
            break;
          }
      }
      this.restorePrototype();
      return undefined;
    }

    /**
        * Coerce either a concrete or ConcolicValue to a boolean
        * Concretizes the ConcolicValue if no coercion rule is known
        */
  }, {
    key: "toBool",
    value: function toBool(val) {
      if (this.isSymbolic(val)) {
        var val_type = _typeof(this.getConcrete(val));
        switch (val_type) {
          case "boolean":
            return val;
          case "number":
            return this.binary("!=", val, this.concolic(0));
          case "string":
            return this.binary("!=", val, this.concolic(""));
        }
        _log["default"].log("WARNING: Concretizing coercion to boolean (toBool) due to unknown type");
      }
      return this.getConcrete(!!val);
    }

    /**
        * Perform a symbolic unary action.
        * Expects an Expr and returns an Expr or undefined if we don't
        * know how to do this op symbolically
        */
  }, {
    key: "_symbolicUnary",
    value: function _symbolicUnary(op, left_c, left_s) {
      this.stats.seen("Symbolic Unary");
      var unaryFn = this._unaryJumpTable[_typeof(left_c)] ? this._unaryJumpTable[_typeof(left_c)][op] : undefined;
      if (unaryFn) {
        return unaryFn(left_s, left_c);
      } else {
        _log["default"].log("Unsupported symbolic operand: ".concat(op, " on ").concat(left_c, " symbolic ").concat(left_s));
        return undefined;
      }
    }
  }, {
    key: "ToString",
    value: function ToString(symbol) {
      if (typeof this.getConcrete(symbol) !== "string") {
        _log["default"].log("TODO: Concretizing non string input ".concat(symbol, " reduced to ").concat(this.getConcrete(symbol)));
        return "" + this.getConcrete(symbol);
      }
      return symbol;
    }

    /**
        * Perform a unary op on a ConcolicValue or a concrete value
        * Concretizes the ConcolicValue if we don't know how to do that action symbolically
        */
  }, {
    key: "unary",
    value: function unary(op, left) {
      var result_c = _symbolicHelper["default"].evalUnary(op, this.getConcrete(left));
      var result_s = this.isSymbolic(left) ? this._symbolicUnary(op, this.getConcrete(left), this.asSymbolic(left)) : undefined;
      return result_s ? new _wrappedValues.ConcolicValue(result_c, result_s) : result_c;
    }

    /**
        * Return a symbol which will always be equal to the constant value val
        * returns undefined if the theory is not supported.
        */
  }, {
    key: "constantSymbol",
    value: function constantSymbol(val) {
      this.stats.seen("Wrapped Constants");
      if (val && _typeof(val) === "object") {
        val = val.valueOf();
      }
      switch (_typeof(val)) {
        case "boolean":
          return val ? this.ctx.mkTrue() : this.ctx.mkFalse();
        case "number":
          return this.ctx.mkNumeral("" + val, this.ctx.mkRealSort());
        case "string":
          return this.ctx.mkString(val.toString());
        default:
          _log["default"].log("Symbolic expressions with " + _typeof(val) + " literals not yet supported.");
      }
      return undefined;
    }

    /**
        * If val is a symbolic value then return val otherwise wrap it
        * with a constant symbol inside a ConcolicValue.
        *
        * Used to turn a concrete value into a constant symbol for symbolic ops.
        */
  }, {
    key: "concolic",
    value: function concolic(val) {
      return this.isSymbolic(val) ? val : new _wrappedValues.ConcolicValue(val, this.constantSymbol(val));
    }
  }, {
    key: "foundGadgets",
    value: function foundGadgets() {
      this.result = true;
    }

    /**
        * Assert left == right on the path condition
     * 
     * @param {boolean} push_constraints
        */
  }, {
    key: "assertEqual",
    value: function assertEqual(left, right) {
      var equalityTest = this.binary("==", left, right);
      this.conditional(equalityTest);
      return this.getConcrete(equalityTest);
    }
  }, {
    key: "addHelperCandidate",
    value: function addHelperCandidate(prop) {
      var index = this.helperCandidates.indexOf(prop);
      if (index != -1) {
        this.helperCandidates.splice(index, 1);
      }
      this.helperCandidates.unshift(prop);
    }

    /**
     * FIXME: Whenever we try to call this.ctx.*, we need to save and restore the prototype
     * 
     */
  }, {
    key: "savePrototype",
    value: function savePrototype() {
      this.saved_prototype = {};
      for (var key in Object.prototype) {
        this.saved_prototype[key] = Object.prototype[key];
        delete Object.prototype[key];
      }
    }
  }, {
    key: "restorePrototype",
    value: function restorePrototype() {
      for (var key in this.saved_prototype) {
        Object.prototype[key] = this.saved_prototype[key];
      }
    }
  }]);
}();
var _default = exports["default"] = SymbolicState;