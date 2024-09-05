"use strict";

var _log = _interopRequireDefault(require("./utilities/log"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); } /**
 * Type coercion system for expoSE+
 * 
 * unaryTypeCoercion and binaryTypeCoercion only retrun the type that the operand should be coerced to
 * we don't need to provide the actual coerced value here, since we can make the type coercion explicit
 * And we implement the toBoolean, toString, toNumber modeled function for the symbolic values
 */
/**
 * Handle the type coercion for the binary operation
 * 
 * We assume at least one of the operand is symbolic value
 * 
 * result = {
 *  op1: operand1,        // the coerced operand1
 *  op2: operand2,        // the coerced operand2
 * }
 * 
 * @param {*} op 
 * @param {*} operand1 
 * @param {*} operand2 
 */
function binaryTypeCoercion(op, operand1, operand2) {
  var ret = {
    op1: operand1,
    op2: operand2
  };

  // FIXME: we should make _isSymbolic as static method(after refactoring the symbolic state)
  var op1 = Object._expose._isSymbolic(operand1) ? operand1.getConcrete() : operand1;
  var op2 = Object._expose._isSymbolic(operand2) ? operand2.getConcrete() : operand2;
  var res = _binaryTypeCoercion(op, op1, op2);
  if (res.cor) {
    if (res.op1 !== "") {
      if (Object._expose._isSymbolic(operand1)) {
        // FIXME: We currently don't support symbolic value coercion
        _log["default"].log("Symbolic value coercion is not supported yet from ".concat(_typeof(operand1.getConcrete()), " to ").concat(res.op1));
      } else {
        ret.op1 = explicitTypeCoerce(res.op1, op1);
      }
    }
    if (res.op2 !== "") {
      if (Object._expose._isSymbolic(operand2)) {
        // FIXME: We currently don't support symbolic value coercion
        _log["default"].log("Symbolic value coercion is not supported yet from ".concat(_typeof(operand2.getConcrete()), " to ").concat(res.op2));
      } else {
        ret.op2 = explicitTypeCoerce(res.op2, op2);
      }
    }
  }
  return ret;
}

/**
 * Handle the type coercion for the unary operation
 * 
 * We assume the operand is symbolic value
 * 
 * result = {
 *  op1: operand1,        // the coerced operand1
 * }
 * 
 * @param {*} op 
 * @param {*} operand1 
 */
function unaryTypeCoercion(op, operand1) {
  var ret = {
    op1: operand1
  };
  var res = _unaryTypeCoercion(op, operand1.getConcrete());
  if (res.cor) {
    if (res.op1 !== "") {
      _log["default"].log("Symbolic value coercion is not supported yet from ".concat(_typeof(operand1.getConcrete), " to ").concat(res.op1));
    }
  }
  return ret;
}
function explicitTypeCoerce(type, value) {
  switch (type) {
    case "string":
      return String(value);
    case "number":
      return Number(value);
    case "boolean":
      return Boolean(value);
    default:
  }
}

/**
 * Given the operator and the two operands, return the coerced result
 * Type coercion due to the mismatch between the operand and operator, operand and operand
 * 
 * result = {
 *  cor: false,      // whether coercion is needed
 *  op1: "",        // empty string if no coercion
 *  op2: "string",   // type that op2 should be coerced to
 * }
 * 
 * TODO: 'asdad' == 'asdas' seems not correct
 */
function _binaryTypeCoercion(op, operand1, operand2) {
  var result = {
    cor: false,
    op1: "",
    op2: ""
  };
  switch (op) {
    case "+":
      // Check if operand types are different and one of them is string
      if (typeof operand1 === "string" || typeof operand2 === "string") {
        result.op1 = typeof operand1 === "string" ? "" : "string";
        result.op2 = typeof operand2 === "string" ? "" : "string";
      } else {
        result.op1 = typeof operand1 === "number" ? "" : "number";
        result.op2 = typeof operand2 === "number" ? "" : "number";
      }
      break;
    case "-":
    case "*":
    case "/":
    case "%":
    case "|":
    case "&":
    case "^":
    case "~":
    case ">":
    case "<":
    case ">=":
    case "<=":
    case "==":
    case "!=":
      // These operators coerce both operands to numbers if they're not
      if (typeof operand1 !== "number") result.op1 = "number";
      if (typeof operand2 !== "number") result.op2 = "number";
      break;
    case "&&":
    case "||":
      // These operators coerce operands to boolean and check whether it is true
      if (typeof operand1 !== "boolean") result.op1 = "boolean";
      if (typeof operand2 !== "boolean") result.op2 = "boolean";
      break;
    default:
      // No coercion needed
      break;
  }
  result.cor = result.op1 !== "" || result.op2 !== "";
  return result;
}

/**
 * Given the operator and the operand, return the coerced result
 * Type coercion due to the mismatch between the operand and the operator 
 * 
 * result = {
 *  cor: false,      // whether coercion is needed
 *  op1: "",        // empty string if no coercion
 * }
 */
function _unaryTypeCoercion(op, operand) {
  var result = {
    op1: ""
  };
  switch (op) {
    case "+":
    case "-":
      // These operators coerce operand to number if it's not
      if (typeof operand !== "number") result.op1 = "number";
      break;
    case "!!":
    case "!":
      // This operator coerces operand to boolean if it's not
      if (typeof operand !== "boolean") result.op1 = "boolean";
      break;
    case "~":
      // This operator coerces operand to number if it's not
      if (typeof operand !== "number") result.op1 = "number";
      break;
    default:
      // No coercion needed
      break;
  }
  result.cor = result.op1 !== "";
  return result;
}
module.exports = {
  binaryTypeCoercion: binaryTypeCoercion,
  unaryTypeCoercion: unaryTypeCoercion
};