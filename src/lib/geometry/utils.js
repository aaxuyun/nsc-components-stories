import axios from 'axios'
import { loadModules } from 'esri-loader'
import queryString from 'query-string'
import { ARCGIS_JS_API } from '@/constants/urls'
import _ from 'lodash'

const ensureGeometryJsonObj = geometryJson => {
  if (typeof geometryJson === 'string') {
    return JSON.parse(geometryJson)
  } else {
    return geometryJson
  }
}

export const getMapServiceJSONDetails = (mapServerUrl = '') => {
  const { url, query } = queryString.parseUrl(mapServerUrl)
  query.f = 'pjson'
  return axios.get(`${url}?${queryString.stringify(query)}`).then(r => r.data)
}

export const getMapServiceLayerType = json => {
  const tiled = window.CVT ? window.CVT.MAP_LAYER_TYPE.TILED.value : 'tiled'
  const dynamic = window.CVT ? window.CVT.MAP_LAYER_TYPE.DYNAMIC.value : 'dynamic'
  return !!json.tileInfo ? tiled : dynamic
}

export const getGeoType = geometryJson => {
  geometryJson = ensureGeometryJsonObj(geometryJson)
  let geometry
  if (geometryJson.geometry) {
    geometry = geometryJson.geometry
  } else {
    geometry = geometryJson
  }
  if ('x' in geometry) {
    return 'point'
  } else if ('rings' in geometry) {
    return 'area'
  } else {
    return 'line'
  }
}

export const getGeoShape = geometryJson => {
  const { attributes = {} } = ensureGeometryJsonObj(geometryJson)
  return attributes.shape
}

export const getCircleInfo = (circleGraphic, jsonFormat = false) => {
  return loadModules([
    'esri/graphic',
    'esri/graphicsUtils'
  ], { url: ARCGIS_JS_API }).then(([Graphic, graphicsUtils]) => {
    const ext = graphicsUtils.graphicsExtent([jsonFormat ? new Graphic(circleGraphic) : circleGraphic])
    const radius = (ext.getWidth() + ext.getHeight()) / 4
    return {
      center: ext.getCenter(),
      radius
    }
  })
}

/**
 * 一个 graphic 由多条不连接的 polyline 组成的 geometry 构成
 * @param  {Graphic}  graphic [description]
 * @return {Boolean}         [description]
 */
export const isMultiLineGeometry = geometryJson => {
  geometryJson = ensureGeometryJsonObj(geometryJson)
  return geometryJson.geometry.paths.length > 1
}

export const isSingleLineGeometry = geometryJson => {
  geometryJson = ensureGeometryJsonObj(geometryJson)
  return geometryJson.geometry.paths && geometryJson.geometry.paths.length === 1
}

export const unionGeometryJsons = (geometryJsons = []) => {
  return loadModules([
    'esri/geometry/geometryEngine',
    'esri/graphic'
  ], { url: ARCGIS_JS_API }).then(([geometryEngine, Graphic]) => {
    const graphics = geometryJsons.map(json => new Graphic(json))
    const geometries = graphics.map(g => g.geometry)
    const geometryResult = geometryEngine.union(geometries)
    return new Graphic(geometryResult, graphics[0].symbol).toJson()
  })
}

/**
 * 线路拼接
 * 做“合并”时，如果是两条线进行合并，并且两条线中有两端点距离小于100米时，可进行
 * 线的拼接合并。拼接时，删去一条线的一个端点，然后和另外一条线进行连接
 * 
 * 条件：
 *  1. 两条线做操作
 *  2. 每条线中都只有一条连续的线
 */
export const jointLinesQuery = (geometries = [], distanceThreshold = .1) => {
  if (geometries.length !== 2) { // two geometries only
    return Promise.resolve(false)
  } else if (getGeoType(geometries[0]) !== 'line' || getGeoType(geometries[1]) !== 'line') {  // two lines
    return Promise.resolve(false)
  } else if (geometries[0].paths.length !== 1 || geometries[1].paths.length !== 1) {  // each line should have single path
    return Promise.resolve(false)
  } else {
    return loadModules([
      'esri/geometry/geometryEngine',
      'esri/geometry/Point',
      'esri/SpatialReference'
    ], { url: ARCGIS_JS_API }).then(([geometryEngine, Point, SpatialReference]) => {
      const sp = new SpatialReference(geometries[0].spatialReference.wkid)
      const l1 = geometries[0].paths[0].length
      const s1 = geometries[0].paths[0][0]
      const e1 = geometries[0].paths[0][l1 - 1]
      const l2 = geometries[1].paths[0].length
      const s2 = geometries[1].paths[0][0]
      const e2 = geometries[1].paths[0][l2 - 1]

      const [d1, d2] = [[s1, e2], [e1, s2]].map(([p1, p2]) => {
        const pt1 = new Point(p1[0], p1[1], sp)
        const pt2 = new Point(p2[0], p2[1], sp)
        return geometryEngine.distance(pt1, pt2, 'kilometers')
      })

      return Math.min(d1, d2) < distanceThreshold
    })
  }
  
}

export const jointLines = (geometryJsons = []) => {
  const [line1, line2] = geometryJsons.map(g => g.geometry)
  return loadModules([
    'esri/geometry/geometryEngine',
    'esri/geometry/Point',
    'esri/geometry/Polyline',
    'esri/SpatialReference'
  ], { url: ARCGIS_JS_API }).then(([
    geometryEngine, Point, Polyline, SpatialReference
  ]) => {
    const sp = new SpatialReference(line1.spatialReference.wkid)
    const l1 = line1.paths[0].length
    const s1 = line1.paths[0][0]
    const e1 = line1.paths[0][l1 - 1]
    const l2 = line2.paths[0].length
    const s2 = line2.paths[0][0]
    const e2 = line2.paths[0][l2 - 1]

    const [d1, d2] = [[s1, e2], [e1, s2]].map(([p1, p2]) => {
      const pt1 = new Point(p1[0], p1[1], sp)
      const pt2 = new Point(p2[0], p2[1], sp)
      return geometryEngine.distance(pt1, pt2, 'kilometers')
    })

    const newLine = new Polyline(sp)

    if (d1 < d2) { // s1 and e2 are more closer: s2 --------> e2 s1 ---------> e1, remove s1
      newLine.addPath([
        ...(line2.paths[0]),
        ...(line1.paths[0].filter((p, i) => i !== 0))
      ])
    } else { // e1 and s2 are more closer: s1 ---------> e1 s2 ----------> e2, remove s2
      newLine.addPath([
        ...(line1.paths[0]),
        ...(line2.paths[0].filter((p, i) => i !== 0))
      ])
    }

    const newGeometryJson = _.cloneDeep(geometryJsons[0])
    newGeometryJson.geometry = newLine
    return newGeometryJson
  })
}

/**
 * 是否可闭合 polyline
 * 1. single polyline
 * 2. points length > 2
 */
export const isAbleToClosePolyline = (geometryJson) => {
  const { geometry } = ensureGeometryJsonObj(geometryJson)
  return geometry.paths && geometry.paths.length === 1 && geometry.paths[0].length > 2
}

/**
 * 闭合 polyline 形成面
 */
export const closePolyline = (geometryJson) => {
  geometryJson = ensureGeometryJsonObj(geometryJson)
  const { symbol, geometry } = geometryJson
  const { paths, spatialReference } = geometry
  const points = [
    ...paths[0],
    paths[0][0]
  ]
  const polygonGeometry = {
    rings: [points],
    spatialReference
  }
  const polygonSymbol = {
    color: [symbol.color[0], symbol.color[1], symbol.color[2], symbol.color[3] * .5],
    outline: symbol,
    style: 'esriSFSSolid',
    type: 'esriSFS'
  }
  
  return {
    attributes: { type: 'polygon' },
    geometry: polygonGeometry,
    symbol: polygonSymbol
  }
}

export const measureAngle = (Pnt1, Pnt2, Pnt3) => {
  const aa = (Pnt1.x - Pnt2.x) * (Pnt1.x - Pnt2.x) + (Pnt1.y - Pnt2.y) * (Pnt1.y - Pnt2.y)
  const a = Math.sqrt(aa)
  const bb = (Pnt3.x - Pnt2.x) * (Pnt3.x - Pnt2.x) + (Pnt3.y - Pnt2.y) * (Pnt3.y - Pnt2.y);
  const b = Math.sqrt(bb)
  const cc = (Pnt1.x - Pnt3.x) * (Pnt1.x - Pnt3.x) + (Pnt1.y - Pnt3.y) * (Pnt1.y - Pnt3.y)
  return Math.acos((aa + bb - cc) / 2 / a / b) * 180 / Math.PI
}

export const updateGeometry = (geometryJson, geometry) => {
  return {
    ...ensureGeometryJsonObj(geometryJson),
    geometry
  }
}