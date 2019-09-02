"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCache = exports.updateCache = exports.getCvts = exports.cacheCvts = exports.getCvtLabel = void 0;

var getCvtLabel = function getCvtLabel(key, cvtValues
/* or code */
) {
  if (typeof cvtValues === 'string') {
    var code = cvtValues;
    return window.CVT[code] && window.CVT[code][key] ? window.CVT[code][key].value : key;
  } else {
    var match = cvtValues.filter(function (item) {
      return item.key === key;
    })[0];
    return match ? match.value : key;
  }
};

exports.getCvtLabel = getCvtLabel;

var cacheCvts = function cacheCvts(projectId, cvts) {
  var cacheKey = projectId || 'base';
  return window.CVT_CACHE[cacheKey] = cvts;
};

exports.cacheCvts = cacheCvts;

var getCvts = function getCvts(projectId) {
  var cacheKey = projectId || 'base';
  return window.CVT_CACHE[cacheKey];
};

exports.getCvts = getCvts;

var updateCache = function updateCache(projectId, cvt) {
  var cache = getCvts(projectId);

  if (cache) {
    cache[cvt.code][cvt.key] = cvt;
    window.CVT = cache;
  }
};

exports.updateCache = updateCache;

var deleteCache = function deleteCache(projectId, _ref) {
  var code = _ref.code,
      key = _ref.key;
  var cache = getCvts(projectId);

  if (cache) {
    delete cache[code][key];
    window.CVT = cache;
  }
};

exports.deleteCache = deleteCache;