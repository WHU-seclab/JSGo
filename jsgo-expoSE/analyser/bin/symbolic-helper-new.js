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
// TDDO: Make all of these into a class
var SymbolicHelper = /*#__PURE__*/function () {
  function SymbolicHelper() {
    _classCallCheck(this, SymbolicHelper);
  }
  return _createClass(SymbolicHelper, null, [{
    key: "isWrapped",
    value: function isWrapped(val) {
      return val instanceof WrappedValue;
    }
  }, {
    key: "isSymbolic",
    value: function isSymbolic(val) {
      return !!ConcolicValue.getSymbolic(val);
    }
  }, {
    key: "isPureSymbol",
    value: function isPureSymbol(symbol) {
      return symbol instanceof PureSymbol;
    }
  }, {
    key: "updateSymbolic",
    value: function updateSymbolic(val, val_s) {
      return ConcolicValue.setSymbolic(val, val_s);
    }
  }, {
    key: "getConcrete",
    value: function getConcrete(val) {
      return val instanceof WrappedValue ? val.getConcrete() : val;
    }
  }, {
    key: "arrayType",
    value: function arrayType(val) {
      return val instanceof WrappedValue ? val.getArrayType() : undefined;
    }
  }, {
    key: "getSymbolic",
    value: function getSymbolic(val) {
      return ConcolicValue.getSymbolic(val);
    }
  }, {
    key: "asSymbolic",
    value: function asSymbolic(val) {
      return ConcolicValue.getSymbolic(val) || this.constantSymbol(val);
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
      return this.isSymbolic(val) ? val : new ConcolicValue(val, this.constantSymbol(val));
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
        Log.log("WARNING: Concretizing coercion to boolean (toBool) due to unknown type");
      }
      return this.getConcrete(!!val);
    }
  }, {
    key: "ToString",
    value: function ToString(symbol) {
      if (typeof this.getConcrete(symbol) !== "string") {
        Log.log("TODO: Concretizing non string input ".concat(symbol, " reduced to ").concat(this.getConcrete(symbol)));
        return "" + this.getConcrete(symbol);
      }
      return symbol;
    }
  }, {
    key: "evalBinary",
    value: function evalBinary(op, left, right) {
      var BinaryJumpTable = {
        "==": function _(left, right) {
          return left == right;
        },
        "===": function _(left, right) {
          return left === right;
        },
        "!=": function _(left, right) {
          return left != right;
        },
        "!==": function _(left, right) {
          return left !== right;
        },
        "<": function _(left, right) {
          return left < right;
        },
        ">": function _(left, right) {
          return left > right;
        },
        "<=": function _(left, right) {
          return left <= right;
        },
        ">=": function _(left, right) {
          return left >= right;
        },
        "+": function _(left, right) {
          return left + right;
        },
        "-": function _(left, right) {
          return left - right;
        },
        "*": function _(left, right) {
          return left * right;
        },
        "/": function _(left, right) {
          return left / right;
        },
        "%": function _(left, right) {
          return left % right;
        },
        ">>": function _(left, right) {
          return left >> right;
        },
        "<<": function _(left, right) {
          return left << right;
        },
        ">>>": function _(left, right) {
          return left >>> right;
        },
        "&": function _(left, right) {
          return left & right;
        },
        "&&": function _(left, right) {
          return left && right;
        },
        "|": function _(l, r) {
          return l | r;
        },
        "||": function _(l, r) {
          return l || r;
        },
        "^": function _(l, r) {
          return l ^ r;
        },
        "instanceof": function _instanceof(l, r) {
          return l instanceof r;
        },
        "in": function _in(l, r) {
          return l in r;
        }
      };
      return BinaryJumpTable[op](left, right);
    }
  }, {
    key: "evalUnary",
    value: function evalUnary(op, left) {
      var UnaryJumpTable = {
        "!": function _(v) {
          return !v;
        },
        "~": function _(v) {
          return ~v;
        },
        "-": function _(v) {
          return -v;
        },
        "+": function _(v) {
          return +v;
        },
        "typeof": function _typeof(v) {
          return _typeof(v);
        }
      };
      return UnaryJumpTable[op](left);
    }
  }]);
}();
var _default = exports["default"] = SymbolicHelper;