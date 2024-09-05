"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof2(o) { "@babel/helpers - typeof"; return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof2(o); }
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

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
    return _typeof2(v);
  }
};
var _default = exports["default"] = {
  evalBinary: function evalBinary(op, left, right) {
    return BinaryJumpTable[op](left, right);
  },
  evalUnary: function evalUnary(op, left) {
    return UnaryJumpTable[op](left);
  }
};