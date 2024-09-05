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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /** jackfromeast
 * 
 * class SymbolicState:
 * 1/ preserve the symolic state of the program (path constraints, input symbols, wrapper symbols, etc.)
 * 2/ create pure/symbolic symbols
 * 
 * TODO: class SymbolicSolver:
 * 1/ solve the path constraints and generate alternative inputs
 * 
 * class SymbolicModel:
 * 1/ provide a bunch of helper functions to generate symbolic representation for different operations(binary operations, unary operations)
 * 2/ currently do not include the modeled functions
 * 
 */ // JALANGI DO NOT INSTRUMENT
var SymbolicState = /*#__PURE__*/function () {
  function SymbolicState(input, undefinedPool, sandbox) {
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
    this.input = input;
    this.inputSymbols = {}; // not including pureSymbol and SymbolicObject, only for symbol that pass to sovler
    this.wrapperSymbols = {}; // pureSymbol and SymbolicObject
    this.pathCondition = [];
    this.undefinedPool = undefinedPool; // lzy: add newly find undefined properties while path exploration

    this.stats = new _main["default"]();
    this.coverage = new _coverage["default"](sandbox);
    this.errors = [];
    this._setupSmtFunctions();
  }

  /** Set up a bunch of SMT functions used by the models **/
  return _createClass(SymbolicState, [{
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
  }, {
    key: "_addInput",
    value: function _addInput(pc, solution, pcIndex, childInputs) {
      solution._bound = pcIndex + 1;
      childInputs.push({
        input: solution,
        pc: this._stringPC(pc),
        forkIid: this.pathCondition[pcIndex].forkIid
      });
    }
  }, {
    key: "_buildPC",
    value: function _buildPC(childInputs, i, inputCallback) {
      var newPC = this.ctx.mkNot(this.pathCondition[i].ast);
      var allChecks = this.pathCondition.slice(0, i).reduce(function (last, next) {
        return last.concat(next.ast.checks);
      }, []).concat(newPC.checks);
      /** jackfromeast
       *  ExpoSE serves each PC as a separate SMT query which seems does not follows the general idea
       *  We will and all the previous PC together with the current mkNot PC and check if it is satisfiable
       */

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
        throw "Bound ".concat(this.input._bound, " > ").concat(this.pathCondition.length, ", divergence has occured");
      }

      // For each pure symbol, summarize it
      for (var _i = 0, _Object$values = Object.values(this.wrapperSymbols); _i < _Object$values.length; _i++) {
        var symbol = _Object$values[_i];
        if (this.isPureSymbol(symbol)) {
          this.summaryPureSymbol(symbol);
        }
      }

      // Path conditions before _bound should always holds true
      this._buildAsserts(Math.min(this.input._bound, this.pathCondition.length)).forEach(function (x) {
        return _this2.slv.assert(x);
      });
      this.slv.push();
      for (var i = this.input._bound; i < this.pathCondition.length; i++) {
        //TODO: Make checks on expressions smarter
        if (!this.pathCondition[i].binder) {
          this._buildPC(childInputs, i, inputCallback);
        }
        //Push the current thing we're looking at to the solver
        this.slv.assert(this.pathCondition[i].ast);
        this.slv.push();
      }
      this.slv.reset();

      //Guarentee inputCallback is called at least once
      inputCallback(childInputs);
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
      var pureType = this.createSymbolicValue(name + "_t", "undefined");
      if (pureType.getConcrete() !== "undefined") {
        // in the following rounds,
        switch (pureType.getConcrete()) {
          case "string":
            // TODO: FIX THIS
            this.assertEqual(pureType, _symbolicHelper["default"].concolic("string"), this); // add the first type constraint
            return this.createSymbolicValue(name, "xxx");
          case "number":
            this.assertEqual(pureType, _symbolicHelper["default"].concolic("number"), this);
            return this.createSymbolicValue(name, 0);
          case "boolean":
            this.assertEqual(pureType, _symbolicHelper["default"].concolic("boolean"), this);
            return this.createSymbolicValue(name, false);
          case "object":
            this.assertEqual(pureType, _symbolicHelper["default"].concolic("object"), this);
            return this.createSymbolicValue(name, {});
          case "array_number":
            this.assertEqual(pureType, _symbolicHelper["default"].concolic("array_number"), this);
            return this.createSymbolicValue(name, [0]);
          case "array_string":
            this.assertEqual(pureType, _symbolicHelper["default"].concolic("array_string"), this);
            return this.createSymbolicValue(name, ["seed_string"]);
          case "array_bool":
            this.assertEqual(pureType, _symbolicHelper["default"].concolic("array_bool"), this);
            return this.createSymbolicValue(name, [false]);
          case "null":
            return null;
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
     * Push type constraints of the pure symbol to the PC
     * @param {pureSymbol} pureSymbol 
     * @returns 
     */
  }, {
    key: "summaryPureSymbol",
    value: function summaryPureSymbol(pureSymbol) {
      var pureType = pureSymbol.getPureType();
      var possibleTypes = pureSymbol.getPossibleTypes();
      var _iterator = _createForOfIteratorHelper(possibleTypes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var type = _step.value;
          this.assertEqual(pureType, _symbolicHelper["default"].concolic(type));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
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
      if (concrete instanceof Array) {
        this.stats.seen("Symbolic Arrays");
        symbolic = this.ctx.mkArray(name, this._getSort(concrete[0]));
        this.pushCondition(this.ctx.mkGe(symbolic.getLength(), this.ctx.mkIntVal(0)), true);
        arrayType = _typeof(concrete[0]);
      } else {
        this.stats.seen("Symbolic Primitives");
        var sort = this._getSort(concrete);
        var symbol = this.ctx.mkStringSymbol(name);
        symbolic = this.ctx.mkConst(symbol, sort);
      }

      // Use generated input if available
      if (name in this.input) {
        concrete = this.input[name];
      } else {
        this.input[name] = concrete;
      }
      this.inputSymbols[name] = symbolic;
      return new _wrappedValues.ConcolicValue(concrete, symbolic, arrayType);
    }
  }, {
    key: "getSolution",
    value: function getSolution(model) {
      var solution = {};
      for (var _i2 = 0, _Object$keys = Object.keys(this.inputSymbols); _i2 < _Object$keys.length; _i2++) {
        var name = _Object$keys[_i2];
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
  }]);
}();
/** jackfromeast
 * 
 * 1/ provide a bunch of helper functions to generate symbolic representation for different operations(binary operations, unary operations)
 * 2/ currently do not include the modeled functions
 * 
 * If the model function need to add pc to the state, then it need to pass the state as an argument
 * E.g. condition(result, state) => {... state.pushCondition(...)}
 * 
 * TODO: we should puts this in the models folder !!!
 */
var SymbolicModel = /*#__PURE__*/function () {
  function SymbolicModel(ctx, stats) {
    _classCallCheck(this, SymbolicModel);
    this.ctx = ctx;
    this.stats = stats;
    this._unaryJumpTable = _buildUnaryJumpTable();
  }

  /**
      * Perform a unary op on a ConcolicValue or a concrete value
      * Concretizes the ConcolicValue if we don't know how to do that action symbolically
      */
  return _createClass(SymbolicModel, [{
    key: "unary",
    value: function unary(op, left) {
      var result_c = _symbolicHelper["default"].evalUnary(op, _symbolicHelper["default"].getConcrete(left));
      var result_s = _symbolicHelper["default"].isSymbolic(left) ? this._symbolicUnary(op, _symbolicHelper["default"].getConcrete(left), _symbolicHelper["default"].asSymbolic(left)) : undefined;
      return result_s ? new _wrappedValues.ConcolicValue(result_c, result_s) : result_c;
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
    key: "_buildUnaryJumpTable",
    value: function _buildUnaryJumpTable() {
      return {
        "boolean": {
          "+": function _(val_s) {
            return this.ctx.mkIte(val_s, this.constantSymbol(1), this.constantSymbol(0));
          },
          "-": function _(val_s) {
            return this.ctx.mkIte(val_s, this.constantSymbol(-1), this.constantSymbol(0));
          },
          "!": function _(val_s) {
            return this.ctx.mkNot(val_s);
          }
        },
        "number": {
          "!": function _(val_s, val_c) {
            var bool_s = _symbolicHelper["default"].asSymbolic(_symbolicHelper["default"].toBool(new _wrappedValues.ConcolicValue(val_c, val_s)));
            return bool_s ? this.ctx.mkNot(bool_s) : undefined;
          },
          "+": function _(val_s) {
            return val_s;
          },
          "-": function _(val_s) {
            return this.ctx.mkUnaryMinus(val_s);
          }
        },
        "string": {
          "!": function _(val_s, val_c) {
            var bool_s = _symbolicHelper["default"].asSymbolic(_symbolicHelper["default"].toBool(new _wrappedValues.ConcolicValue(val_c, val_s)));
            return bool_s ? this.ctx.mkNot(bool_s) : undefined;
          },
          "+": function _(val_s) {
            return this.ctx.mkStrToInt(val_s);
          },
          "-": function _(val_s) {
            return this.ctx.mkUnaryMinus(this.ctx.mkStrToInt(val_s));
          }
        }
      };
    }

    /** 
      	* Symbolic binary operation, expects at least one values and an operator
      	*/
  }, {
    key: "binary",
    value: function binary(op, left, right) {
      // jackfromeast
      left = _symbolicHelper["default"].concolic(left);
      right = _symbolicHelper["default"].concolic(right);
      if (typeof _symbolicHelper["default"].getConcrete(left) === "string") {
        right = _symbolicHelper["default"].ToString(right);
      }
      var result_c = _symbolicHelper["default"].evalBinary(op, _symbolicHelper["default"].getConcrete(left), _symbolicHelper["default"].getConcrete(right));
      var result_s = this._symbolicBinary(op, _symbolicHelper["default"].getConcrete(left), _symbolicHelper["default"].asSymbolic(left), _symbolicHelper["default"].getConcrete(right), _symbolicHelper["default"].asSymbolic(right));
      return _typeof(result_s) !== undefined ? new _wrappedValues.ConcolicValue(result_c, result_s) : result_c;
    }
  }, {
    key: "_symbolicBinary",
    value: function _symbolicBinary(op, left_c, left_s, right_c, right_s) {
      this.stats.seen("Symbolic Binary");
      switch (op) {
        case "===":
        case "==":
          return this.ctx.mkEq(left_s, right_s);
        case "!==":
        case "!=":
          return this.ctx.mkNot(this.ctx.mkEq(left_s, right_s));
        case "&&":
          return this.ctx.mkAnd(left_s, right_s);
        case "||":
          return this.ctx.mkOr(left_s, right_s);
        case ">":
          return this.ctx.mkGt(left_s, right_s);
        case ">=":
          return this.ctx.mkGe(left_s, right_s);
        case "<=":
          return this.ctx.mkLe(left_s, right_s);
        case "<":
          return this.ctx.mkLt(left_s, right_s);
        case "<<":
        case "<<<":
          left_s = this.ctx.mkRealToInt(left_s);
          right_s = this.ctx.mkRealToInt(right_s);
          return this.ctx.mkIntToReal(this.ctx.mkMul(left_s, this.ctx.mkPower(this.ctx.mkIntVal(2), right_s)));
        case ">>":
        case ">>>":
          left_s = this.ctx.mkRealToInt(left_s);
          right_s = this.ctx.mkRealToInt(right_s);
          return this.ctx.mkIntToReal(this.ctx.mkDiv(left_s, this.ctx.mkPower(this.ctx.mkIntVal(2), right_s)));
        case "+":
          return typeof left_c === "string" ? this.ctx.mkSeqConcat([left_s, right_s]) : this.ctx.mkAdd(left_s, right_s);
        case "-":
          return this.ctx.mkSub(left_s, right_s);
        case "*":
          return this.ctx.mkMul(left_s, right_s);
        case "/":
          return this.ctx.mkDiv(left_s, right_s);
        case "%":
          return this.ctx.mkMod(left_s, right_s);
        default:
          _log["default"].log("Symbolic execution does not support operand ".concat(op, ", concretizing."));
          break;
      }
      return undefined;
    }

    /** jackfromeast
    * Symbolic field lookup - currently only has support for symbolic arrays / strings
      	*/
  }, {
    key: "symbolicField",
    value: function symbolicField(base_c, base_s, field_c, field_s, state) {
      this.stats.seen("Symbolic Field");
      function canHaveFields() {
        return typeof base_c === "string" || base_c instanceof Array;
      }
      function isRealNumber() {
        return typeof field_c === "number" && Number.isFinite(field_c);
      }
      if (canHaveFields() && isRealNumber()) {
        var withinBounds = this.ctx.mkAnd(this.ctx.mkGt(field_s, this.ctx.mkIntVal(-1)), this.ctx.mkLt(field_s, base_s.getLength()));
        if (this.conditional(new _wrappedValues.ConcolicValue(field_c > -1 && field_c < base_c.length, withinBounds), state)) {
          return base_s.getField(this.ctx.mkRealToInt(field_s));
        } else {
          return undefined;
        }
      }
      switch (field_c) {
        case "length":
          {
            if (base_s.getLength()) {
              return base_s.getLength();
            } else {
              _log["default"].log("No length field on symbolic value");
            }
            break;
          }
        default:
          {
            _log["default"].log("Unsupported symbolic field - concretizing " + base_c + " and field " + field_c);
            break;
          }
      }
      return undefined;
    }
  }, {
    key: "conditional",
    value: function conditional(result, state) {
      var result_c = this.getConcrete(result),
        result_s = this.asSymbolic(result);
      if (result_c === true) {
        state.pushCondition(result_s);
      } else if (result_c === false) {
        state.pushCondition(this.ctx.mkNot(result_s));
      } else {
        _log["default"].log("WARNING: Symbolic Conditional on non-bool, concretizing");
      }
      return result_c;
    }

    /** jackfromeast
     * Used for making the input argument of a function concrete
     */
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
        * Assert left == right on the path condition
     * 
     * @param {boolean} push_constraints
        */
  }, {
    key: "assertEqual",
    value: function assertEqual(left, right, state) {
      var equalityTest = this.binary("==", left, right);
      this.conditional(equalityTest, state);
      return this.getConcrete(equalityTest);
    }
  }]);
}();
var _default = exports["default"] = {
  SymbolicState: SymbolicState,
  SymbolicModel: SymbolicModel
};