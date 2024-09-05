"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// var _notAnErrorException = _interopRequireDefault(require("../not-an-error-exception"));
var _IsNative = require("../utilities/IsNative");
var _wrappedValues = require("../values/wrapped-values");
var _helpers = _interopRequireDefault(require("./helpers"));
var _mathModels = _interopRequireDefault(require("./math-models"));
var _arrayModels = _interopRequireDefault(require("./array-models"));
var _stringModels = _interopRequireDefault(require("./string-models"));
var _fnModels = _interopRequireDefault(require("./fn-models"));
var _regexModels = _interopRequireDefault(require("./regex-models"));
var _domModels = _interopRequireDefault(require("./dom-models"));
var _jsonModels = _interopRequireDefault(require("./json-models"));
var _log = _interopRequireDefault(require("../utilities/log"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

function Model() {
  this._models = [];
  this.add = function (fn, _mdl) {
    this._models.push({
      fn: fn,
      mdl: function mdl() {
        return _mdl.call(null, this, arguments);
      }
    });
  };
  this.get = function (fn) {
    var found = this._models.find(function (x) {
      return x.fn == fn;
    });
    return found ? found.mdl : null;
  };
}

/**
 * Builds a set of function models bound to a given SymbolicState
 */
function BuildModels(state) {
  var ctx = state.ctx;
  var model = new Model();
  var helpers = (0, _helpers["default"])(state, ctx, model);
  (0, _mathModels["default"])(state, ctx, model, helpers);
  (0, _stringModels["default"])(state, ctx, model, helpers);
  (0, _regexModels["default"])(state, ctx, model, helpers);
  (0, _arrayModels["default"])(state, ctx, model, helpers);
  (0, _fnModels["default"])(state, ctx, model, helpers);
  (0, _domModels["default"])(state, ctx, model, helpers);
  (0, _jsonModels["default"])(state, ctx, model, helpers);

  /**
   * Models for methods on Object
   */
  model.add(Object, function (base, args) {
    var concrete = state.concretizeCall(Object, base, args, false);
    var result = Object.apply(concrete.base, concrete.args);
    if (!(concrete.args[0] instanceof Object) && state.isSymbolic(args[0])) {
      result = new _wrappedValues.ConcolicValue(result, state.asSymbolic(args[0]));
    }
    return result;
  });

  /**
   * Secret _expose hooks for symbols.js
   */

  Object._expose = {};
  Object._expose.makeSymbolic = function (name, initial) {
    return state.createSymbolicValue(name, initial);
  };
  Object._expose.notAnError = function () {
    return;
  };
  Object._expose.pureSymbol = function (name) {
    return state.createPureSymbol(name);
  };
  Object._expose._isSymbolic = function (val) {
    return state.isSymbolic(val) ? true : false;
  };
  Object._expose.setupSymbols = function () {
    return state._setupUndefinedUT();
  };
  Object._expose.setupASymbol = function (name, val) {
    return state.setupUndefined(name, val);
  };
  Object._expose._foundGadgets = function () {
    _log["default"].logSink("ACI: Arbitrary Content Interpolation");
    _log["default"].logSink("Found a potential flow to the return value");
    state.foundGadgets();
  };
  Object._expose._foundGadgetsEval = function () {
    _log["default"].logSink("Found a potential flow to the eval function!");
    state.foundGadgets();
  };
  return model;
}
var _default = exports["default"] = BuildModels;
