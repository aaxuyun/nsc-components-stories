"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMultiLineGeometry = exports.getGeoType = exports.getMapServiceLayerType = exports.getMapServiceJSONDetails = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getMapServiceJSONDetails = function getMapServiceJSONDetails(url) {
  return _axios["default"].get("".concat(url, "?f=pjson")).then(function (r) {
    return r.data;
  });
};

exports.getMapServiceJSONDetails = getMapServiceJSONDetails;

var getMapServiceLayerType = function getMapServiceLayerType(json) {
  var tiled = window.CVT ? window.CVT.MAP_LAYER_TYPE.TILED.value : 'tiled';
  var dynamic = window.CVT ? window.CVT.MAP_LAYER_TYPE.DYNAMIC.value : 'dynamic';
  return !!json.tileInfo ? tiled : dynamic;
};

exports.getMapServiceLayerType = getMapServiceLayerType;

var getGeoType = function getGeoType(geometryJson) {
  if (typeof geometryJson === 'string') {
    geometryJson = JSON.parse(geometryJson);
  }

  if ('x' in geometryJson.geometry) {
    return 'point';
  } else if ('rings' in geometryJson.geometry) {
    return 'area';
  } else {
    return 'line';
  }
};
/**
 * 一个 graphic 由多条不连接的 polyline 组成的 geometry 构成
 * @param  {Graphic}  graphic [description]
 * @return {Boolean}         [description]
 */


exports.getGeoType = getGeoType;

var isMultiLineGeometry = function isMultiLineGeometry(geometryJson) {
  if (typeof geometryJson === 'string') {
    geometryJson = JSON.parse(geometryJson);
  }

  return geometryJson.geometry.paths.length > 1;
};

exports.isMultiLineGeometry = isMultiLineGeometry;