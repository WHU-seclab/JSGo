"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _default(state, ctx, model, helpers) {
  var ConcretizeIfNative = helpers.ConcretizeIfNative;
  var symbolicHook = helpers.symbolicHook;

  //TODO: Test IsNative for apply, bind & call
  model.add(Function.prototype.apply, ConcretizeIfNative(Function.prototype.apply));
  model.add(Function.prototype.call, ConcretizeIfNative(Function.prototype.call));
  model.add(Function.prototype.bind, ConcretizeIfNative(Function.prototype.bind));
  model.add(Object.prototype.hasOwnProperty, function (base, args) {
    for (var i = 0; i < args.length; i++) {
      args[i] = state.getConcrete(args[i]);
    }
    return Object.prototype.hasOwnProperty.apply(state.getConcrete(base), args);
  });
  model.add(Object.prototype.keys, function (base, args) {
    for (var i = 0; i < args.length; i++) {
      args[i] = state.getConcrete(args[i]);
    }
    return Object.prototype.keys.apply(state.getConcrete(base), args);
  });

  // jackfromeast
  model.add(Object.prototype.toString, symbolicHook(Object.prototype.toString, function (base, _a) {
    return state.isSymbolic(base) && _typeof(state.getConcrete(base)) === "object";
  }, function (base, _a, result) {
    if (state.isSymbolic(base)) {
      return new ConcolicValue(base.toString(), ctx.mkString('[object Object]'));
    } else {
      return base.toString();
    }
  }));
  model.add(Object.assign, function (base, args) {
    return Object.assign.call(base, state.getConcrete(args[0]), state.getConcrete(args[1]));
  });
  model.add(Array.isArray, function (base, args) {
    return Array.isArray.call(base, state.getConcrete(args[0]));
  });
  model.add(console.log, function (base, args) {
    for (var i = 0; i < args.length; i++) {
      args[i] = state.getConcrete(args[i]);
    }
    console.log.apply(base, args);
  });
}