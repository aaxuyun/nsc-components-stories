"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/lib/row/style");

var _row = _interopRequireDefault(require("antd/lib/row"));

require("antd/lib/col/style");

var _col = _interopRequireDefault(require("antd/lib/col"));

require("antd/lib/button/style");

var _button = _interopRequireDefault(require("antd/lib/button"));

require("antd/lib/select/style");

var _select = _interopRequireDefault(require("antd/lib/select"));

require("antd/lib/input/style");

var _input = _interopRequireDefault(require("antd/lib/input"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Toolbar = _interopRequireDefault(require("../../lib/components/Toolbar"));

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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Tool = _Toolbar["default"].Tool,
    Group = _Toolbar["default"].Group;

var Input = function Input(_ref) {
  var style = _ref.style,
      restProps = _objectWithoutProperties(_ref, ["style"]);

  return _react["default"].createElement(Tool, null, _react["default"].createElement(_input["default"], _extends({
    style: _objectSpread({}, style, {
      width: 180
    })
  }, restProps)));
};

var Select = function Select(_ref2) {
  var style = _ref2.style,
      children = _ref2.children,
      restProps = _objectWithoutProperties(_ref2, ["style", "children"]);

  return _react["default"].createElement(Tool, null, _react["default"].createElement(_select["default"], _extends({
    style: _objectSpread({}, style, {
      width: 180
    }),
    showSearch: true,
    optionFilterProp: "children"
  }, restProps), children));
};

var SearchBox = function SearchBox(_ref3) {
  var placeholder = _ref3.placeholder,
      icon = _ref3.icon,
      onClick = _ref3.onClick,
      onPressEnter = _ref3.onPressEnter,
      onChange = _ref3.onChange,
      children = _ref3.children;
  return _react["default"].createElement(Group, null, children ? (children.length ? children : [children]).map(function (c, i) {
    return _react["default"].createElement(Tool, {
      key: i
    }, c);
  }) : _react["default"].createElement(Tool, null, _react["default"].createElement(Input, {
    placeholder: placeholder,
    style: {
      width: 240
    },
    onPressEnter: onPressEnter,
    onChange: onChange
  })), _react["default"].createElement(Tool, null, _react["default"].createElement(_button["default"], {
    icon: icon,
    type: "primary",
    onClick: onClick
  })));
};

SearchBox.propTypes = {
  placeholder: _propTypes["default"].string.isRequired,
  icon: _propTypes["default"].string.isRequired,
  onClick: _propTypes["default"].func.isRequired,
  onPressEnter: _propTypes["default"].func
};
SearchBox.defaultProps = {
  placeholder: '输入搜索关键词',
  icon: 'search',
  onClick: function onClick() {},
  onPressEnter: function onPressEnter() {}
};

var CreateButton = function CreateButton(_ref4) {
  var text = _ref4.text,
      icon = _ref4.icon,
      onClick = _ref4.onClick,
      restProps = _objectWithoutProperties(_ref4, ["text", "icon", "onClick"]);

  return _react["default"].createElement(Tool, null, _react["default"].createElement(_button["default"], _extends({
    type: "primary",
    icon: icon,
    onClick: onClick
  }, restProps), text));
};

CreateButton.propTypes = {
  text: _propTypes["default"].string.isRequired,
  icon: _propTypes["default"].string.isRequired,
  onClick: _propTypes["default"].func.isRequired
};
CreateButton.defaultProps = {
  text: '新建',
  icon: 'plus',
  onClick: function onClick() {}
};

var PageToolbar =
/*#__PURE__*/
function (_Component) {
  _inherits(PageToolbar, _Component);

  function PageToolbar() {
    _classCallCheck(this, PageToolbar);

    return _possibleConstructorReturn(this, _getPrototypeOf(PageToolbar).apply(this, arguments));
  }

  _createClass(PageToolbar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          leftTools = _this$props.leftTools,
          rightTools = _this$props.rightTools;
      return _react["default"].createElement(_row["default"], {
        type: "flex",
        justify: "space-between",
        style: {
          marginBottom: 20
        }
      }, _react["default"].createElement(_col["default"], null, _react["default"].createElement(_Toolbar["default"], null, leftTools)), _react["default"].createElement(_col["default"], null, _react["default"].createElement(_Toolbar["default"], null, rightTools)));
    }
  }]);

  return PageToolbar;
}(_react.Component);

PageToolbar.propTypes = {
  leftTools: _propTypes["default"].arrayOf(_propTypes["default"].node),
  rightTools: _propTypes["default"].arrayOf(_propTypes["default"].node)
};
PageToolbar.defaultProps = {
  leftTools: [],
  rightTools: []
};
PageToolbar.SearchBox = SearchBox;
PageToolbar.CreateButton = CreateButton;
PageToolbar.Select = Select;
PageToolbar.Input = Input;
var _default = PageToolbar;
exports["default"] = _default;