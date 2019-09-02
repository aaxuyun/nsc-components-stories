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

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var TooltipButton = function TooltipButton(props) {
  var children = props.children,
      tip = props.tip,
      placement = props.placement,
      restProps = _objectWithoutProperties(props, ["children", "tip", "placement"]);

  return _react["default"].createElement(_tooltip["default"], {
    title: tip,
    placement: placement
  }, _react["default"].createElement(_button["default"], restProps, children));
};

TooltipButton.propTypes = {
  tip: _propTypes["default"].string.isRequired,
  placement: _propTypes["default"].string.isRequired
};
TooltipButton.defaultProps = {
  placement: 'top'
};
var _default = TooltipButton;
exports["default"] = _default;