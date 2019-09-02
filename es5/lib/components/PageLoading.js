"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/lib/spin/style");

var _spin = _interopRequireDefault(require("antd/lib/spin"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(_ref) {
  var _ref$loading = _ref.loading,
      loading = _ref$loading === void 0 ? true : _ref$loading,
      size = _ref.size;
  return loading ? _react["default"].createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }, _react["default"].createElement(_spin["default"], {
    size: size
  })) : null;
};

exports["default"] = _default;