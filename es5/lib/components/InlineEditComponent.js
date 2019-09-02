"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contentEditable = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var contentEditable = function contentEditable(WrappedComponent) {
  var _temp;

  return _temp =
  /*#__PURE__*/
  function (_Component) {
    _inherits(_temp, _Component);

    function _temp(props) {
      var _this;

      _classCallCheck(this, _temp);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_temp).call(this, props));

      _defineProperty(_assertThisInitialized(_this), "singleClickHandler", function (event) {
        _this.dblClicked = false;
        setTimeout(function () {
          if (!_this.dblClicked) {
            _this.toggleEdit(event);
          }
        }, 500);
      });

      _defineProperty(_assertThisInitialized(_this), "doubleClickHandler", function (e) {
        _this.dblClicked = true;
      });

      _defineProperty(_assertThisInitialized(_this), "toggleEdit", function (e) {
        if (_this.state.editing) {
          _this.cancel();
        } else {
          _this.edit();
        }
      });

      _defineProperty(_assertThisInitialized(_this), "edit", function () {
        _this.setState({
          editing: true
        }, function () {
          document.execCommand('selectAll', false, null);

          _this.domElm.focus();
        });
      });

      _defineProperty(_assertThisInitialized(_this), "save", function () {
        _this.setState({
          editing: false
        }, function () {
          var onSave = _this.props.onSave;

          if (onSave && _this.isValueChanged()) {
            var result = onSave(_this.domElm.textContent);

            if (result.then) {
              result.then(function (r) {
                return r === false && (_this.domElm.textContent = _this.props.value);
              });
            } else if (result === false) {
              _this.domElm.textContent = _this.props.value;
            }
          }
        });
      });

      _defineProperty(_assertThisInitialized(_this), "cancel", function () {
        _this.setState({
          editing: false
        }, function () {
          window.getSelection().removeAllRanges();
          _this.domElm.textContent = _this.props.value;
        });
      });

      _defineProperty(_assertThisInitialized(_this), "isValueChanged", function () {
        return _this.props.value !== _this.domElm.textContent;
      });

      _defineProperty(_assertThisInitialized(_this), "handleKeyDown", function (e) {
        var key = e.key;

        switch (key) {
          case 'Enter':
            _this.save();

            break;

          case 'Escape':
            _this.cancel();

            break;
        }
      });

      _this.state = {
        editing: false
      };
      _this.dblClicked = false;
      return _this;
    }

    _createClass(_temp, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var editing = this.state.editing;

        var _this$props = this.props,
            _this$props$editOnCli = _this$props.editOnClick,
            editOnClick = _this$props$editOnCli === void 0 ? true : _this$props$editOnCli,
            onSave = _this$props.onSave,
            _this$props$editStyle = _this$props.editStyle,
            editStyle = _this$props$editStyle === void 0 ? {} : _this$props$editStyle,
            style = _this$props.style,
            restProps = _objectWithoutProperties(_this$props, ["editOnClick", "onSave", "editStyle", "style"]);

        return _react["default"].createElement(WrappedComponent, _extends({
          onClick: editOnClick ? this.singleClickHandler : undefined,
          onDoubleClick: this.doubleClickHandler,
          contentEditable: editing,
          ref: function ref(domNode) {
            _this2.domElm = domNode;
          },
          onBlur: this.cancel,
          onKeyDown: this.handleKeyDown,
          suppressContentEditableWarning: "true",
          style: _objectSpread({}, style, {}, editing ? editStyle : {})
        }, restProps), this.props.value);
      }
    }]);

    return _temp;
  }(_react.Component), _temp;
};

exports.contentEditable = contentEditable;