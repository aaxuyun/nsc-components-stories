"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datetimeFormat = void 0;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var datetimeFormat = function datetimeFormat(v) {
  if (!v) {
    v = '';
  }

  if (typeof v === 'string') {
    v = new Date(v);
  }

  if (v.toString() === 'Invalid Date') {
    return '';
  } else {
    return (0, _moment["default"])(v).format('YYYY-MM-DD HH:mm:ss');
  }
};

exports.datetimeFormat = datetimeFormat;