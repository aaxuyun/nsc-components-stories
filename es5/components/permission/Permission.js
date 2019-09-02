"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _permission = require("@/utils/permission");

/**
 * simple mode, if has no permissions, it will render null
 * 
 * <Permission required={[]} granted={[*]}>
 *   <MyProtectedButton />
 * </Permission>
 * 
 * 
 * advance mode, you can control your children component based on hasPermission value
 * 
 * <Permission required={[]} granted={[*]} mode="advance">
 *  {hasPermission => <MyProtectedButton disabled={!hasPermission} />}
 * </Permission>
 */
var _default = function _default(_ref) {
  var children = _ref.children,
      _ref$required = _ref.required,
      required = _ref$required === void 0 ? [] : _ref$required,
      _ref$granted = _ref.granted,
      granted = _ref$granted === void 0 ? [] : _ref$granted,
      _ref$mode = _ref.mode,
      mode = _ref$mode === void 0 ? 'simple' : _ref$mode;
  var ableToAccess = (0, _permission.hasPermission)(required, granted);

  if (mode === 'advance') {
    return children(ableToAccess);
  } else {
    return ableToAccess ? children : null;
  }
};

exports["default"] = _default;