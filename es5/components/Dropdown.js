"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/lib/dropdown/style");

var _dropdown = _interopRequireDefault(require("antd/lib/dropdown"));

require("antd/lib/button/style");

var _button = _interopRequireDefault(require("antd/lib/button"));

require("antd/lib/icon/style");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

require("antd/lib/menu/style");

var _menu = _interopRequireDefault(require("antd/lib/menu"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var noop = function noop() {};

var Dropdown = function Dropdown(props) {
  var n = 0;

  var label = props.label,
      menus = props.menus,
      mode = props.mode,
      onMenuClick = props.onMenuClick,
      children = props.children,
      restProps = _objectWithoutProperties(props, ["label", "menus", "mode", "onMenuClick", "children"]);

  var renderMenuItem = function renderMenuItem(item) {
    if (item === 'divider') {
      return _react["default"].createElement(_menu["default"].Divider, {
        key: n++
      });
    } else if (item.children && item.children.length > 0) {
      return _react["default"].createElement(_menu["default"].SubMenu, {
        title: item.label,
        key: item.key,
        disabled: !!item.disabled
      }, item.children.map(function (subItem) {
        return renderMenuItem(subItem);
      }));
    } else {
      return _react["default"].createElement(_menu["default"].Item, {
        key: item.key,
        disabled: !!item.disabled
      }, item.label);
    }
  };

  var menu = _react["default"].createElement(_menu["default"], {
    onClick: function onClick(e) {
      return onMenuClick(e.key, e);
    }
  }, menus.map(function (item) {
    return renderMenuItem(item);
  }));

  return _react["default"].createElement(_dropdown["default"], {
    overlay: menu
  }, children ? children : mode === 'button' ? _react["default"].createElement(_button["default"], restProps, label, " ", _react["default"].createElement(_icon["default"], {
    type: "down"
  })) : _react["default"].createElement("a", restProps, label, " ", _react["default"].createElement(_icon["default"], {
    type: "down"
  })));
};

Dropdown.propTypes = {
  label: _propTypes["default"].node.isRequired,
  menus: _propTypes["default"].array.isRequired,
  mode: _propTypes["default"].oneOf(['button', 'link']),
  onMenuClick: _propTypes["default"].func
};
Dropdown.defaultProps = {
  onMenuClick: noop,
  menus: [],
  type: 'link'
};
var _default = Dropdown;
exports["default"] = _default;