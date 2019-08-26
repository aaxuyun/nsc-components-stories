"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DragM =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DragM, _React$Component);

  function DragM() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DragM);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DragM)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "position", {
      startX: 0,
      startY: 0,
      dx: 0,
      dy: 0,
      tx: 0,
      ty: 0
    });

    _defineProperty(_assertThisInitialized(_this), "reset", function () {
      _this.position = {
        startX: 0,
        startY: 0,
        dx: 0,
        dy: 0,
        tx: 0,
        ty: 0
      };
    });

    _defineProperty(_assertThisInitialized(_this), "start", function (event) {
      if (event.button != 0) {
        //只允许左键，右键问题在于不选择conextmenu就不会触发mouseup事件
        return;
      }

      var onClicked = _this.props.onClicked;
      onClicked && onClicked();
      document.addEventListener("mousemove", _this.docMove);
      _this.position.startX = event.pageX - _this.position.dx;
      _this.position.startY = event.pageY - _this.position.dy;
    });

    _defineProperty(_assertThisInitialized(_this), "docMove", function (event) {
      if (event.clientX < 20 || event.clientY < 20 || event.clientX > document.body.clientWidth - 20 || event.clientY > document.body.clientHeight - 20) {
        return;
      }

      var tx = event.pageX - _this.position.startX;
      var ty = event.pageY - _this.position.startY;
      var transformStr = "translate(".concat(tx, "px,").concat(ty, "px)");

      _this.props.updateTransform(transformStr, tx, ty, _this.tdom);

      _this.position.dx = tx;
      _this.position.dy = ty;
    });

    _defineProperty(_assertThisInitialized(_this), "docMouseUp", function (event) {
      document.removeEventListener("mousemove", _this.docMove);
    });

    return _this;
  }

  _createClass(DragM, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.tdom.addEventListener("mousedown", this.start); //用document移除对mousemove事件的监听

      document.addEventListener("mouseup", this.docMouseUp);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.tdom.removeEventListener("mousedown", this.start);
      document.removeEventListener("mouseup", this.docMouseUp);
      document.removeEventListener("mousemove", this.docMove);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var children = this.props.children;

      var newStyle = _objectSpread({}, children.props.style, {
        cursor: "move",
        userSelect: "none"
      });

      return _react["default"].cloneElement(_react["default"].Children.only(children), {
        ref: function ref(tdom) {
          return _this2.tdom = tdom;
        },
        style: newStyle
      });
    }
  }]);

  return DragM;
}(_react["default"].Component);

exports["default"] = DragM;

_defineProperty(DragM, "propTypes", {
  children: _propTypes["default"].element.isRequired
});

_defineProperty(DragM, "defaultProps", {
  //默认是移动children dom,覆盖该方法，可以把tranform行为同步给外部
  updateTransform: function updateTransform(transformStr, tx, ty, tdom) {
    tdom.style.transform = transformStr;
  }
});