"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openModal = exports["default"] = void 0;

require("antd/lib/modal/style");

var _modal = _interopRequireDefault(require("antd/lib/modal"));

require("antd/lib/button/style");

var _button = _interopRequireDefault(require("antd/lib/button"));

require("antd/lib/message/style");

var _message2 = _interopRequireDefault(require("antd/lib/message"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _func = require("@/utils/func");

var _ui = require("@/utils/ui");

var _DragMove = _interopRequireDefault(require("@/lib/components/DragMove"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

var _getWindowSize = (0, _ui.getWindowSize)(),
    height = _getWindowSize.height;

var zIndex = 200;
/**
 * when onOk() returns false or Promise false, then isPrevent is true
 * isPreventClose(onOk).then(isPrevent => {})
 */

var isPreventClose = function isPreventClose(onOk) {
  onOk = onOk || function () {};

  return new Promise(function (resolve) {
    var value = onOk();

    if (value === false) {
      resolve(true);
    } else if (!value) {
      resolve(false);
    } else if (value.then) {
      value.then(function (r) {
        return resolve(r === false);
      });
    }
  });
};

var MovableTitle =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MovableTitle, _React$Component);

  function MovableTitle(props) {
    var _this;

    _classCallCheck(this, MovableTitle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MovableTitle).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "onClicked", function () {
      zIndex++;
      _this.modalDom.style.zIndex = zIndex;
    });

    _defineProperty(_assertThisInitialized(_this), "updateTransform", function (transformStr) {
      _this.modalDom.style.transform = transformStr;
    });

    zIndex++;
    return _this;
  }

  _createClass(MovableTitle, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var modal = this.props.modal;
      this.modalDom = _reactDom["default"].findDOMNode(modal).querySelector('.ant-modal-wrap');
      this.modalDom.style.transform = '';
      this.modalDom.style.pointerEvents = 'none';
      this.modalDom.querySelector('.ant-modal').style.pointerEvents = 'auto';
      this.modalDom.style.zIndex = zIndex;
      this.reset();
    }
  }, {
    key: "reset",
    value: function reset() {
      this.dragger.reset();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var title = this.props.title;
      return _react["default"].createElement(_DragMove["default"], {
        ref: function ref(_ref) {
          return _this2.dragger = _ref;
        },
        onClicked: this.onClicked,
        updateTransform: this.updateTransform
      }, _react["default"].createElement("div", null, title));
    }
  }]);

  return MovableTitle;
}(_react["default"].Component);

var BaseModal =
/*#__PURE__*/
function (_Component) {
  _inherits(BaseModal, _Component);

  function BaseModal(props) {
    var _this3;

    _classCallCheck(this, BaseModal);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(BaseModal).call(this, props));

    _defineProperty(_assertThisInitialized(_this3), "showModalHandler", function () {
      _this3.props.onClick();

      _this3.setState({
        visible: true
      });

      _this3.props.onVisible();
    });

    _defineProperty(_assertThisInitialized(_this3), "hideModalHandler", function () {
      _this3.setState({
        visible: false
      });
    });

    _defineProperty(_assertThisInitialized(_this3), "okHandler", function () {
      _message2["default"].destroy();

      var result = _this3.props.onOk();

      if (!_this3.isControlled()) {
        if (result.then) {
          result.then(function (r) {
            return r !== false && _this3.hideModalHandler();
          });
        } else if (result !== false) {
          _this3.hideModalHandler();
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this3), "cancelHandler", function () {
      _message2["default"].destroy();

      if (!_this3.isControlled()) {
        _this3.hideModalHandler();
      }

      _this3.props.onCancel();
    });

    _this3.state = {
      visible: false
    };
    return _this3;
  }

  _createClass(BaseModal, [{
    key: "isControlled",
    value: function isControlled() {
      return 'visible' in this.props;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.isControlled() && nextProps.visible && !this.props.visible) {
        this.props.onVisible();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props = this.props,
          displayButtons = _this$props.displayButtons,
          children = _this$props.children,
          label = _this$props.label,
          title = _this$props.title,
          okText = _this$props.okText,
          cancelText = _this$props.cancelText,
          _this$props$width = _this$props.width,
          width = _this$props$width === void 0 ? 600 : _this$props$width,
          autoSize = _this$props.autoSize,
          editable = _this$props.editable,
          modal = _this$props.modal,
          forceRender = _this$props.forceRender,
          restProps = _objectWithoutProperties(_this$props, ["displayButtons", "children", "label", "title", "okText", "cancelText", "width", "autoSize", "editable", "modal", "forceRender"]);

      var isControlled = this.isControlled();
      var visible = isControlled ? this.props.visible : this.state.visible;
      var footerButtons = [_react["default"].createElement(_button["default"], {
        key: "cancel",
        onClick: this.cancelHandler
      }, cancelText), _react["default"].createElement(_button["default"], {
        key: "ok",
        onClick: this.okHandler,
        type: "primary",
        disabled: !editable
      }, okText)].filter(function (c) {
        if (displayButtons[0] === '*') {
          return true;
        } else {
          return displayButtons.includes(c.key);
        }
      });
      return _react["default"].createElement("span", null, isControlled ? null : _react["default"].createElement("span", {
        onClick: this.showModalHandler
      }, label), _react["default"].createElement(_modal["default"], _extends({
        ref: function ref(_ref2) {
          return _this4.modal = _ref2;
        }
      }, restProps, {
        title: modal ? title : _react["default"].createElement(MovableTitle, {
          title: title,
          modal: this.modal
        }),
        visible: visible,
        onOk: this.okHandler,
        onCancel: this.cancelHandler,
        width: width,
        destroyOnClose: true,
        footer: footerButtons
      }, modal || {
        mask: false,
        maskClosable: false
      }), _react["default"].createElement("div", {
        style: autoSize ? {
          height: height * 0.60,
          overflowY: 'auto',
          overflowX: 'hidden'
        } : {
          maxHeight: height * 0.60,
          overflowY: 'auto',
          overflowX: 'hidden'
        }
      }, forceRender ? children : visible ? children : null)));
    }
  }]);

  return BaseModal;
}(_react.Component);

BaseModal.BaseModal = {
  label: _propTypes["default"].node.isRequired,
  title: _propTypes["default"].string.isRequired,
  visible: _propTypes["default"].bool,
  // visible can be controlled from outside
  onOk: _propTypes["default"].func,
  onCancel: _propTypes["default"].func,
  okText: _propTypes["default"].string,
  cancelText: _propTypes["default"].string,
  onClick: _propTypes["default"].func,
  onVisible: _propTypes["default"].func,
  editable: _propTypes["default"].bool,
  displayButtons: _propTypes["default"].array,
  autoSize: _propTypes["default"].bool,
  modal: _propTypes["default"].bool,
  forceRender: _propTypes["default"].bool
};
BaseModal.defaultProps = {
  label: '弹框',
  title: '无标题',
  onOk: _func.noop,
  onCancel: _func.noop,
  okText: '确认',
  cancelText: '取消',
  onClick: _func.noop,
  onVisible: _func.noop,
  editable: true,
  displayButtons: ['*'],
  autoSize: true,
  modal: true,
  forceRender: true
};
var _default = BaseModal;
/**
 * const modal = openModal({ content, .... })
 * modal.update({ title: 'xx' })
 * modal.close()
 */

exports["default"] = _default;

var openModal = function openModal(_ref3) {
  var content = _ref3.content,
      modalProps = _objectWithoutProperties(_ref3, ["content"]);

  var div = window.document.createElement('div');
  window.document.body.appendChild(div);

  var currentProps = _objectSpread({}, modalProps, {
    visible: true,
    autoSize: true,
    onCancel: modalProps.onCancel || close,
    onOk: modalProps.onOk || close,
    content: content
  });

  function render(_ref4) {
    var content = _ref4.content,
        props = _objectWithoutProperties(_ref4, ["content"]);

    _reactDom["default"].render(_react["default"].createElement(_modal["default"], props, _react["default"].createElement("div", {
      style: props.autoSize ? {
        height: height * 0.60,
        overflowY: 'auto',
        overflowX: 'hidden'
      } : {
        maxHeight: height * 0.60,
        overflowY: 'auto',
        overflowX: 'hidden'
      }
    }, content)), div);
  }

  function update(updateProps) {
    currentProps = _objectSpread({}, currentProps, {}, updateProps);
    render(currentProps);
  }

  function close() {
    currentProps = _objectSpread({}, currentProps, {
      visible: false,
      afterClose: function afterClose() {
        var unmountResult = _reactDom["default"].unmountComponentAtNode(div);

        if (unmountResult && div.parentNode) {
          div.parentNode.removeChild(div);
        }
      }
    });
    render(currentProps);
  }

  render(currentProps);
  return {
    update: update,
    close: close
  };
};

exports.openModal = openModal;