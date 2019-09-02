"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWindowSize = exports.getMatchedMenuItem = void 0;

var _pathToRegexp = _interopRequireDefault(require("path-to-regexp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getMatchedMenuItem = function getMatchedMenuItem(menus, url) {
  var items = [];

  var getFlatMenuItems = function getFlatMenuItems(menus, parent) {
    menus.forEach(function (item) {
      if (item.children) {
        getFlatMenuItems(item.children, item);
      } else {
        items.push(_objectSpread({}, item, {
          parentKey: parent ? parent.key : ''
        }));
      }
    });
    return items;
  };

  getFlatMenuItems(menus);
  var match = items.find(function (item) {
    return (0, _pathToRegexp["default"])(item.link).test(url);
  });

  if (!match) {
    console.warn('cannot match current href with admin sidebar menu item links', url);
    return {};
  }

  return match;
};

exports.getMatchedMenuItem = getMatchedMenuItem;

var getWindowSize = function getWindowSize() {
  var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  return {
    width: width,
    height: height
  };
};

exports.getWindowSize = getWindowSize;