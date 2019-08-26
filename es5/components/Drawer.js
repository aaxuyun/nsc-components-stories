"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/lib/icon/style");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactAddonsCssTransitionGroup = _interopRequireDefault(require("react-addons-css-transition-group"));

var _DynamicMountComponent = _interopRequireDefault(require("../components/DynamicMountComponent"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * props.title
 * props.onClose
 */
var Drawer =
/*#__PURE__*/
function (_Component) {
  _inherits(Drawer, _Component);

  function Drawer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Drawer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Drawer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "handleClose", function () {
      var onClose = _this.props.onClose;

      _this.root.classList.add('is-leaving');

      setTimeout(function () {
        _this.root.classList.remove('is-leaving');

        onClose && onClose();
      }, 300);
    });

    return _this;
  }

  _createClass(Drawer, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          _this$props$title = _this$props.title,
          title = _this$props$title === void 0 ? '详细信息' : _this$props$title,
          children = _this$props.children,
          onClose = _this$props.onClose,
          restProps = _objectWithoutProperties(_this$props, ["title", "children", "onClose"]);

      return _react["default"].createElement(_reactAddonsCssTransitionGroup["default"], {
        transitionName: "drawer-anim",
        transitionAppear: true,
        transitionAppearTimeout: 300,
        transitionEnterTimeout: 300,
        transitionLeaveTimeout: 300
      }, _react["default"].createElement("div", _extends({
        className: "c-drawer"
      }, restProps, {
        ref: function ref(root) {
          return _this2.root = root;
        }
      }), _react["default"].createElement("div", {
        className: "c-drawer__header"
      }, _react["default"].createElement("h4", {
        className: "c-drawer__title"
      }, title), _react["default"].createElement(_icon["default"], {
        type: "close",
        className: "c-drawer__closeBtn",
        onClick: this.handleClose
      })), _react["default"].createElement("div", {
        className: "c-drawer__body"
      }, _react["default"].createElement("div", {
        className: "c-drawer__content"
      }, children))));
    }
  }]);

  return Drawer;
}(_react.Component);

Drawer.propTypes = {
  title: _propTypes["default"].string,
  onClose: _propTypes["default"].func
};
Drawer.defaultProps = {
  onClose: function onClose() {}
  /**
   * props.visible
   * ... Drawer.props
   */

};

var Wrapper =
/*#__PURE__*/
function (_Component2) {
  _inherits(Wrapper, _Component2);

  function Wrapper(props) {
    var _this3;

    _classCallCheck(this, Wrapper);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Wrapper).call(this, props));

    _defineProperty(_assertThisInitialized(_this3), "handleClose", function () {
      var onClose = _this3.props.onClose;
      onClose ? onClose() : _this3.setState({
        visible: false
      });
    });

    _this3.state = {
      visible: props.visible || false
    };
    return _this3;
  }

  _createClass(Wrapper, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        visible: nextProps.visible
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          restProps = _objectWithoutProperties(_this$props2, ["children"]);

      var visible = this.state.visible;
      return _react["default"].createElement(_DynamicMountComponent["default"], _extends({
        visible: visible,
        component: Drawer,
        onClose: this.handleClose
      }, restProps), children);
    }
  }]);

  return Wrapper;
}(_react.Component);

exports["default"] = Wrapper;