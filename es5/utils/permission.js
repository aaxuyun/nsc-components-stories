"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasPermission = void 0;

var hasPermission = function hasPermission(permissionsRequired, permissionsGranted) {
  permissionsRequired = typeof permissionsRequired === 'string' ? [permissionsRequired] : permissionsRequired;
  permissionsGranted = typeof permissionsGranted === 'string' ? [permissionsGranted] : permissionsGranted;

  if (permissionsGranted.includes('*') || permissionsRequired.length === 0) {
    return true;
  } else {
    return permissionsRequired.filter(function (p) {
      return permissionsGranted.includes(p);
    }).length === permissionsRequired.length;
  }
};

exports.hasPermission = hasPermission;