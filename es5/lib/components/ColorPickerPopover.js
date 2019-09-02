"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/lib/popover/style");

var _popover = _interopRequireDefault(require("antd/lib/popover"));

require("antd/lib/button/style");

var _button = _interopRequireDefault(require("antd/lib/button"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactColor = require("react-color");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ColorPicker =
/*#__PURE__*/
function (_Component) {
  _inherits(ColorPicker, _Component);

  function ColorPicker(props) {
    var _this;

    _classCallCheck(this, ColorPicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ColorPicker).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (color) {
      _this.setState({
        color: color.rgb
      });

      var onChange = _this.props.onChange;
      onChange && onChange(color.rgb);
    });

    _this.state = {
      color: props.value || {}
    };
    return _this;
  }

  _createClass(ColorPicker, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value && nextProps.value !== this.props.value) {
        this.setState({
          color: nextProps.value
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled;
      var color = this.state.color;
      var colorStr = "rgba(".concat(color.r, ", ").concat(color.g, ", ").concat(color.b, ", ").concat(color.a, ")");

      var content = _react["default"].createElement(_reactColor.SketchPicker, {
        color: color,
        onChange: this.handleChange
      });

      return _react["default"].createElement(_popover["default"], {
        content: content,
        trigger: "click"
      }, _react["default"].createElement(_button["default"], {
        style: {
          width: '100%',
          borderRadius: 4,
          background: colorStr
        },
        disabled: disabled
      }));
    }
  }]);

  return ColorPicker;
}(_react.Component);

ColorPicker.propTypes = {
  onChange: _propTypes["default"].func
};
ColorPicker.defaultProps = {};
var _default = ColorPicker;
exports["default"] = _default;