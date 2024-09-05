"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PureSymbol = void 0;
var _wrappedValues = require("./wrapped-values");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /** jackfromeast
 * 
 * when we create an pure symbol, what we are trying to say is that the type/sort of the value is undecidable yet
 * in ExpoSE, they try to mkNot of all the others types and tese them one by one
 * in ExpoSE+, we try to determine the type of the value in the first round, add the possible type constraints and only check these types in the following rounds
 * 
 * when conduct symbolic execution with prueSymbol, all the operations(binary, unary, methods, etc) will helps to determine what types COULD the value holds, and push to the path constraints
 * however, since javascript supports an implicit type conversion, we are trying to determine the type of the value that most likely to be and necessary to be 
 * 
 * TODO: the decision of the type of the pure symbol should be keep refining
 * e.g.
 * if there aren't any forin/get/set operations, then object/array won't be pushed to the path constraints
 * 
 * TODO: should we summary the type of the pure symbol in the end of the execution?
 * currently, we add types once we seen a new operation
 * however, to determine the valid type of the pure symbol, we need to check all the operations
 * e.g.
 * if(x.a.length > 0) { ... } => x.a is an array, object, or string
 * x.a + ".local" => x.a can only be a string, or array (due to the implicit type conversion)
 * 
 * FIXME: 
 * if we only try to indicate the type of pureSymbol in the first round, some operations may not be visible as the concrete value is undefined
 * e.g.
 * if (x.a && x.a.length > 0) { ... }
 * a could be an array or object, however, we don't know the length field has been visited in the first round
 * 
 * 
 */
/**
 * the following are the methods names of the different object
 * delete the shared methods for different types: toString, valueOf, toLocaleString
 */
var MethodDict = /*#__PURE__*/_createClass(function MethodDict() {
  _classCallCheck(this, MethodDict);
} // this is a static class 
);
_defineProperty(MethodDict, "string_methods", ["charAt", "charCodeAt", "concat", "endsWith", "includes", "indexOf", "lastIndexOf", "localeCompare", "match", "normalize", "padEnd", "padStart", "repeat", "replace", "search", "slice", "split", "startsWith", "substring", "toLocaleLowerCase", "toLocaleUpperCase", "toLowerCase", "toUpperCase", "trim", "trimStart", "trimEnd"]);
_defineProperty(MethodDict, "array_methods", ["concat", "copyWithin", "entries", "every", "fill", "filter", "find", "findIndex", "flat", "flatMap", "forEach", "includes", "indexOf", "join", "keys", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "reverse", "shift", "slice", "some", "sort", "splice", "unshift", "values", "length"]);
_defineProperty(MethodDict, "number_methods", ["toExponential", "toFixed", "toLocaleString", "toPrecision"]);
// static boolean_methods = ["toString", "valueOf"]
_defineProperty(MethodDict, "object_methods", ["hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable"]);
var PureSymbol = exports.PureSymbol = /*#__PURE__*/function (_WrappedValue) {
  function PureSymbol(name) {
    var _this;
    _classCallCheck(this, PureSymbol);
    _this = _callSuper(this, PureSymbol, [undefined]);
    _this.__defineProperty("_name", name);
    _this.__defineProperty("_possibleTypes", []);
    _this.__defineProperty("_pureType", undefined);
    _this.__defineProperty("_method_dict", {
      "string": MethodDict.string_methods,
      "array": MethodDict.array_methods,
      "number": MethodDict.number_methods,
      // "boolean": MethodDict.boolean_methods,
      "object": MethodDict.object_methods
    });
    return _this;
  }
  _inherits(PureSymbol, _WrappedValue);
  return _createClass(PureSymbol, [{
    key: "__defineProperty",
    value: function __defineProperty(name, value) {
      Object.defineProperty(this, name, {
        value: value,
        enumerable: false,
        writable: true,
        configurable: true
      });
    }

    /**
     * try to determine the type of the pure symbol through the operations
     * 
     * for the binary operations, we can determine the type of the pure symbol by the type of the operands
     * for the unary operations, we can indicate the type of the pure symbol by the type of the operator
     * for the methods, we can indicate the type of the pure symbol by through the name of the method
     * @param {string} op_type: binary, unary, method
     * @param {string} op: operator or method name 
     * @param {*} operand_type: only exists if the op_type is binary
     * @param {*} get_field_name: only exists if the op_type is method and op is getField
     */
  }, {
    key: "addType",
    value: function addType(op_type, op) {
      var operand_type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var get_field_name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
      if (op_type === "binary") {
        this.__handleBinaryType(op, operand_type);
      } else if (op_type === "unary") {
        this.__handleUnaryType(op);
      } else if (op_type === "method") {
        this.__handleMethodType(op, get_field_name);
      }
    }

    /**
     * determine the type of the pure symbol by the type of the operator
     * however, the usually the type of the unary operator is not enough to determine the type of the pure symbol
     * @param {*} op : +, -, ~, !, typeof
     */
  }, {
    key: "__handleUnaryType",
    value: function __handleUnaryType(op) {
      var possible_type = "unknown";
      if (op === "+") {
        // could be number, boolean, etc
        // shouldn't be undefined, null, object, array, string, etc
      } else if (op === "-") {
        // could be number, boolean, etc
        // shouldn't be undefined, null, object, array, string, etc
      } else if (op === "~") {
        // could be all kinds of primitive types
        // shouldn't be object, array, etc
      } else if (op === "!") {
        // could be all kinds of primitive types
        // shouldn't be object, array, etc
      } else if (op === "typeof") {
        // could be all kinds of primitive types
        // shouldn't be object, array, etc
      } else {
        possible_type = "unknown";
      }
    }

    /**
     * determine the type of the pure symbol by the type of the operands
     * @param {*} op: +, - , *, /, %, <<, >>, >>>, &, |, ^, ==, !=, ===, !==, <, <=, >, >=, instanceof, in
     * @param {*} operand_type 
     */
  }, {
    key: "__handleBinaryType",
    value: function __handleBinaryType(op, operand_type) {
      var possible_type = "unknown";
      if (op !== 'in') {
        if (operand_type === "boolean") {
          possible_type = "boolean";
          this._possibleTypes.push(possible_type);
        } else if (operand_type === "number") {
          possible_type = "number";
          this._possibleTypes.push(possible_type);
        } else if (operand_type === "string") {
          possible_type = "string";
          this._possibleTypes.push(possible_type);
        } else if (operand_type === "object") {
          possible_type = "object";
          this._possibleTypes.push(possible_type);
        } else if (operand_type === "array") {
          // TODO: the array type is not accurate
          possible_type = "array";
          this._possibleTypes.push(possible_type);
        } else {
          possible_type = "unknown";
        }
      } else if (op === 'in') {
        this._possibleTypes.push("array");
        this._possibleTypes.push("object");
      }
    }

    /**
     * determine the type of the pure symbol by the name of the method
     * 
     * A found issue:
     * if the something like `a.b.c` apprears, although b is most likely an object, but there also a chance that we can make a.b a primitive and c an other primitive(undefined property) 
     * 
     * 
     * TODO:
     * For the getField method, there are three cases for the offset:
     * 1. built-in method name: string, array, number, boolean, object
     * 2. index(numeric): array
     * 3. property name(string): object
     * 
     */
  }, {
    key: "__handleMethodType",
    value: function __handleMethodType(op, field_name) {
      // most likely the pure symbol is an object
      this._possibleTypes.push("object");

      // other possible types
      if (op === 'getField') {
        for (var _i = 0, _Object$entries = Object.entries(this._method_dict); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            type = _Object$entries$_i[0],
            methodList = _Object$entries$_i[1];
          if (methodList.includes(field_name)) {
            this._possibleTypes.push(type);
          }
        }
      }
    }
  }, {
    key: "getPossibleTypes",
    value: function getPossibleTypes() {
      // if the type is unknown
      if (this._possibleTypes.length === 0) {
        return ["string", "object", "array_string"];
      } else {
        // always include string
        this._possibleTypes.push("string");
        return Array.from(new Set(this._possibleTypes));
      }
    }
  }, {
    key: "getName",
    value: function getName() {
      return this._name;
    }
  }, {
    key: "setPureType",
    value: function setPureType(type) {
      this._pureType = type;
    }
  }, {
    key: "getPureType",
    value: function getPureType() {
      return this._pureType;
    }
  }]);
}(_wrappedValues.WrappedValue);