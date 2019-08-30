import axios from 'axios'

export const getMapServiceJSONDetails = url => {
  return axios.get(`${url}?f=pjson`).then(r => r.data)
}

export const getMapServiceLayerType = json => {
  const tiled = window.CVT ? window.CVT.MAP_LAYER_TYPE.TILED.value : 'tiled'
  const dynamic = window.CVT ? window.CVT.MAP_LAYER_TYPE.DYNAMIC.value : 'dynamic'
  return !!json.tileInfo ? tiled : dynamic
}

export const getGeoType = geometryJson => {
  if (typeof geometryJson === 'string') {
    geometryJson = JSON.parse(geometryJson)
  }
  if ('x' in geometryJson.geometry) {
    return 'point'
  } else if ('rings' in geometryJson.geometry) {
    return 'area'
  } else {
    return 'line'
  }
}

/**
 * 一个 graphic 由多条不连接的 polyline 组成的 geometry 构成
 * @param  {Graphic}  graphic [description]
 * @return {Boolean}         [description]
 */
export const isMultiLineGeometry = geometryJson => {
  if (typeof geometryJson === 'string') {
    geometryJson = JSON.parse(geometryJson)
  }
  return geometryJson.geometry.paths.length > 1
}
