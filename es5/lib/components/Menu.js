"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/lib/menu/style");

var _menu = _interopRequireDefault(require("antd/lib/menu"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var SubMenu = _menu["default"].SubMenu,
    ItemGroup = _menu["default"].ItemGroup,
    Divider = _menu["default"].Divider,
    Item = _menu["default"].Item;

var Menu = function Menu(_ref) {
  var menus = _ref.menus,
      restProps = _objectWithoutProperties(_ref, ["menus"]);

  var uid = 0;

  var renderMenuItem = function renderMenuItem(menuItem) {
    if (menuItem === 'divider') {
      // divider
      return _react["default"].createElement(Divider, {
        key: uid++
      });
    } else if (!menuItem.children || menuItem.children.length === 0) {
      // menu item
      var children = menuItem.children,
          title = menuItem.title,
          rest = _objectWithoutProperties(menuItem, ["children", "title"]);

      return _react["default"].createElement(Item, rest, title);
    } else if (menuItem.key && menuItem.children.length > 0) {
      // sub menu
      var _children = menuItem.children,
          _rest = _objectWithoutProperties(menuItem, ["children"]);

      return _react["default"].createElement(SubMenu, _rest, _children.map(function (menu) {
        return renderMenuItem(menu);
      }));
    } else if (!menuItem.key && menuItem.children.length > 0) {
      // item group
      var _children2 = menuItem.children,
          disabled = menuItem.disabled,
          key = menuItem.key,
          _rest2 = _objectWithoutProperties(menuItem, ["children", "disabled", "key"]);

      return _react["default"].createElement(ItemGroup, _rest2, _children2.map(function (menu) {
        return renderMenuItem(menu);
      }));
    }
  };

  return _react["default"].createElement(_menu["default"], restProps, menus.map(function (menu) {
    return renderMenuItem(menu);
  }));
};

Menu.propTypes = {
  menus: _propTypes["default"].array.isRequired // other Antd.Menu propTypes

};
Menu.defaultProps = {
  menus: [] // [{ title, key, disabled, children } | 'divider']

};
var _default = Menu;
exports["default"] = _default;