"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/lib/tooltip/style");

var _tooltip = _interopRequireDefault(require("antd/lib/tooltip"));

require("antd/lib/button/style");

var _button = _interopRequireDefault(require("antd/lib/button"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var TooltipButton = function TooltipButton(props) {
  var children = props.children,
      tip = props.tip,
      type = props.type,
      placement = props.placement,
      restProps = _objectWithoutProperties(props, ["children", "tip", "type", "placement"]);

  return _react["default"].createElement(_tooltip["default"], {
    title: tip,
    placement: placement
  }, _react["default"].createElement(_button["default"], _extends({}, restProps, {
    type: type
  }), children));
};

TooltipButton.propTypes = {
  tip: _propTypes["default"].string.isRequired,
  placement: _propTypes["default"].string.isRequired,
  type: _propTypes["default"].string.isRequired
};
TooltipButton.defaultProps = {
  placement: 'top',
  type: 'default'
};
var _default = TooltipButton;
exports["default"] = _default;