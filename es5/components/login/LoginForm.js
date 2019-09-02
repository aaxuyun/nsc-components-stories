"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/lib/row/style");

var _row = _interopRequireDefault(require("antd/lib/row"));

require("antd/lib/col/style");

var _col = _interopRequireDefault(require("antd/lib/col"));

require("antd/lib/input/style");

var _input = _interopRequireDefault(require("antd/lib/input"));

require("antd/lib/icon/style");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

require("antd/lib/form/style");

var _form = _interopRequireDefault(require("antd/lib/form"));

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FormItem = _form["default"].Item;

var LoginForm =
/*#__PURE__*/
function (_Component) {
  _inherits(LoginForm, _Component);

  function LoginForm() {
    _classCallCheck(this, LoginForm);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoginForm).apply(this, arguments));
  }

  _createClass(LoginForm, [{
    key: "render",
    value: function render() {
      var form = this.props.form;
      var getFieldDecorator = form.getFieldDecorator;
      return _react["default"].createElement(_form["default"], null, _react["default"].createElement(_row["default"], {
        gutter: 40
      }, _react["default"].createElement(_col["default"], {
        span: 24
      }, _react["default"].createElement(FormItem, null, getFieldDecorator('username', {
        rules: [{
          required: true,
          message: '账号不能为空'
        }]
      })(_react["default"].createElement(_input["default"], {
        size: "large",
        prefix: _react["default"].createElement(_icon["default"], {
          type: "user"
        }),
        placeholder: "\u8BF7\u8F93\u5165\u8D26\u53F7"
      })))), _react["default"].createElement(_col["default"], {
        span: 24
      }, _react["default"].createElement(FormItem, null, getFieldDecorator('password', {
        rules: [{
          required: true,
          message: '密码不能为空'
        }]
      })(_react["default"].createElement(_input["default"], {
        size: "large",
        type: "password",
        prefix: _react["default"].createElement(_icon["default"], {
          type: "lock"
        }),
        placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801"
      }))))));
    }
  }]);

  return LoginForm;
}(_react.Component);

var _default = _form["default"].create()(LoginForm);

exports["default"] = _default;