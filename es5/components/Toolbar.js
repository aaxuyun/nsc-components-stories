"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Toolbar = _interopRequireDefault(require("./Toolbar.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Toolbar = function Toolbar(_ref) {
  var _classNames;

  var children = _ref.children,
      inline = _ref.inline,
      compact = _ref.compact,
      restProps = _objectWithoutProperties(_ref, ["children", "inline", "compact"]);

  var classes = (0, _classnames["default"])((_classNames = {}, _defineProperty(_classNames, _Toolbar["default"].toolbarInline, inline), _defineProperty(_classNames, _Toolbar["default"].toolbar, !inline), _defineProperty(_classNames, _Toolbar["default"].compact, compact), _classNames));
  return _react["default"].createElement("div", _extends({
    className: classes
  }, restProps), children);
};

Toolbar.propTypes = {
  inline: _propTypes["default"].bool.isRequired,
  compact: _propTypes["default"].bool.isRequired
};
Toolbar.defaultProps = {
  inline: false,
  compact: false
};

var Group = function Group(_ref2) {
  var children = _ref2.children;
  return _react["default"].createElement("span", {
    className: _Toolbar["default"].group
  }, children);
};

var Tool = function Tool(_ref3) {
  var children = _ref3.children;
  return _react["default"].createElement("span", {
    className: _Toolbar["default"].tool
  }, children);
};

Toolbar.Group = Group;
Toolbar.Tool = Tool;
var _default = Toolbar;
exports["default"] = _default;