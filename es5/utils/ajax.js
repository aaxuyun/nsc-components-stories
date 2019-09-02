"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redirectToLogin = exports["default"] = void 0;

require("antd/lib/modal/style");

var _modal = _interopRequireDefault(require("antd/lib/modal"));

require("antd/lib/message/style");

var _message2 = _interopRequireDefault(require("antd/lib/message"));

var _axios = _interopRequireDefault(require("axios"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var showingError = false;

var loadingIndicator = function () {
  var DELAY = 300;
  var handler = null;
  var timerId = 0;
  return {
    show: function show() {
      if (timerId) {
        clearTimeout(timerId);
        timerId = 0;
      }

      if (handler) {
        // is showing
        return;
      } else {
        handler = _message2["default"].loading('加载中...', 0);
      }
    },
    hide: function hide() {
      // 延迟调用 hide，避免了在短时间内（DELAY）多次调用 show() 而导致的弹出多个 indicator
      timerId = setTimeout(function () {
        if (handler) {
          handler();
          handler = null;
        }
      }, DELAY);
    }
  };
}();

window.loader = loadingIndicator;

var request = function request(method) {
  var showLoadingIndicator = true;

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (args[1] && 'showLoadingIndicator' in args[1]) {
    showLoadingIndicator = !!args[1].showLoadingIndicator;
    delete args[1].showLoadingIndicator;
  }

  showLoadingIndicator && loadingIndicator.show();
  return _axios["default"][method].apply(_axios["default"], args)["catch"](function (e) {
    showLoadingIndicator && loadingIndicator.hide(); // message.error('请求错误')

    throw e; // will handle in app.onError defined in index.js
  }).then(function (_ref) {
    var status = _ref.status,
        statusText = _ref.statusText,
        data = _ref.data,
        headers = _ref.headers;
    showLoadingIndicator && loadingIndicator.hide();

    if (data.statusCode === 0) {
      return data.data;
    } else if (data.statusCode === -1) {
      // message.error(`${data.error.code}: ${data.error.message}`)
      console.warn(data.error);
      throw new Error(data.error.message); // will handle in app.onError defined in index.js
    } else if (data.statusCode === -2) {
      if (!showingError) {
        _modal["default"].error({
          title: '接口授权失败',
          content: '当前用户在其他地方登录，请重新登录',
          onOk: function onOk() {
            showingError = false;
            redirectToLogin();
          }
        });

        showingError = true;
      }

      throw new Error('接口授权失败');
    } else if (data.statusCode === 1) {
      // message.error('请求参数错误')
      data.details.forEach(function (d) {
        return _message2["default"].error(d.message);
      });
      throw new Error('请求参数错误'); // will handle in app.onError defined in index.js
    } else {
      throw new Error(data.error.message);
    }
  });
};

var _default = {
  get: function get() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return request.apply(void 0, ['get'].concat(args));
  },
  post: function post() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return request.apply(void 0, ['post'].concat(args));
  },
  put: function put() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return request.apply(void 0, ['put'].concat(args));
  },
  "delete": function _delete() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return request.apply(void 0, ['delete'].concat(args));
  }
};
exports["default"] = _default;

var redirectToLogin = function redirectToLogin() {
  var redirectTo = encodeURIComponent(window.location.hash.substring(1));
  window.location.href = "?redirectTo=".concat(redirectTo);
};

exports.redirectToLogin = redirectToLogin;