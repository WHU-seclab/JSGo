"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.stringify = stringify;
// JALANGI DO NOT INSTRUMENT

/**
 * In some circumstances the analyser may see an internal JSON call 
 * as a call from the program-under-test and model it. Here
 * we provide a wrapper to stringify to avoid this.
 */

var safeStringify = JSON.stringify;
var safeParse = JSON.parse;
function stringify() {
  return safeStringify.apply(null, arguments);
}
function parse() {
  return safeParse.apply(null, arguments);
}