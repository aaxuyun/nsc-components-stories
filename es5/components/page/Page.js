"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Content = _interopRequireDefault(require("./Content"));

var _ContentPane = _interopRequireDefault(require("./ContentPane"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(_ref) {
  var children = _ref.children,
      fullHeight = _ref.fullHeight;
  return _react["default"].createElement(_Content["default"], {
    fullHeight: fullHeight
  }, _react["default"].createElement(_ContentPane["default"], {
    style: {
      margin: fullHeight ? 0 : '24px 0'
    }
  }, children));
};

exports["default"] = _default;