"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ColorPickerPopover = _interopRequireDefault(require("@/lib/components/ColorPickerPopover"));

var _ContextMenu = _interopRequireDefault(require("@/lib/components/ContextMenu"));

var _DragMove = _interopRequireDefault(require("@/lib/components/DragMove"));

var _Drawer = _interopRequireDefault(require("@/lib/components/Drawer"));

var _Dropdown = _interopRequireDefault(require("@/lib/components/Dropdown"));

var _DynamicMountComponent = _interopRequireDefault(require("@/lib/components/DynamicMountComponent"));

var _IFrame = _interopRequireDefault(require("@/lib/components/IFrame"));

var _InlineEditComponent = _interopRequireDefault(require("@/lib/components/InlineEditComponent"));

var _Menu = _interopRequireDefault(require("@/lib/components/Menu"));

var _PageLoading = _interopRequireDefault(require("@/lib/components/PageLoading"));

var _PropertiesTable = _interopRequireDefault(require("@/lib/components/PropertiesTable"));

var _TextEllipsis = _interopRequireDefault(require("@/lib/components/TextEllipsis"));

var _Toolbar = _interopRequireDefault(require("@/lib/components/Toolbar"));

var _Table = _interopRequireDefault(require("@/components/Table"));

var _confirm = _interopRequireDefault(require("@/components/confirm"));

var _LoginForm = _interopRequireDefault(require("@/components/login/LoginForm"));

var _CodeVerifyForm = _interopRequireDefault(require("@/components/login/CodeVerifyForm"));

var _BaseModal = _interopRequireDefault(require("@/components/modal/BaseModal"));

var _Page = _interopRequireDefault(require("@/components/page/Page"));

var _PageToolbar = _interopRequireDefault(require("@/components/page/PageToolbar"));

var _Permission = _interopRequireDefault(require("@/components/permission/Permission"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var lib = {
  ColorPicker: _ColorPickerPopover["default"],
  CtxMenu: _ContextMenu["default"],
  DragM: _DragMove["default"],
  Drawer: _Drawer["default"],
  Dropdown: _Dropdown["default"],
  DynamicMountComponent: _DynamicMountComponent["default"],
  IFrame: _IFrame["default"],
  contentEditable: _InlineEditComponent["default"],
  Menu: _Menu["default"],
  PageLoading: _PageLoading["default"],
  PropertiesTable: _PropertiesTable["default"],
  TextEllipsis: _TextEllipsis["default"],
  Toolbar: _Toolbar["default"]
};
var components = {
  Table: _Table["default"],
  confirm: _confirm["default"],
  LoginForm: _LoginForm["default"],
  CodeVerifyForm: _CodeVerifyForm["default"],
  BaseModal: _BaseModal["default"],
  page: _Page["default"],
  PageToolbar: _PageToolbar["default"],
  Permission: _Permission["default"]
};
var NSC = {
  lib: lib,
  components: components
};
var _default = NSC;
exports["default"] = _default;