"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

/* global window */

function is_external() {
  return typeof window !== "undefined";
}
function calectron() {
  if (!window._ELC) {
    window._ELC = require("electron");
  }
  return window._ELC;
}

//Cache electron so require doesn't get rewritten
var ld = is_external() ? calectron().remote.require : require;
var electronWindow = is_external() ? calectron().remote.getCurrentWindow() : null;
var _default = exports["default"] = {
  load: function load(library) {
    return ld(library);
  },
  close: function close() {
    if (electronWindow) {
      electronWindow.close();
    } else {
      process.exit(0);
    }
  },
  is_external: is_external
};