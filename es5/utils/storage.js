"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = exports.set = void 0;

var set = function set(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
};

exports.set = set;

var get = function get(key) {
  try {
    var obj = JSON.parse(localStorage.getItem(key));
    return obj;
  } catch (e) {
    return null;
  }
};

exports.get = get;