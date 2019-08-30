import { MAP_LAYER_TYPES, MAX_SUBLAYERS, VALID_WKIDS } from './constants'
import queryString from 'query-string'

export const noop = () => {}

export const isOfficalModule = url => url.startsWith('dojo/') || url.startsWith('esri/')

export const modulePath = (path, noneOfficialPrefix) => isOfficalModule(path) ? path : `${noneOfficialPrefix}/${path}`

// [{ name, path }] => [ path ]
export const getModules = (modules = [], arcgisStaticPath) => modules.map(m => modulePath(m.path, arcgisStaticPath))

// ([{ name, path }], [ Map, XX ]) => { name: Map }
export const getModuleConstructorMapping = (modules = [], constructors = []) => {
  const mapping = {}
  modules.forEach((m, i) => {
    mapping[m.name] = constructors[i]
  })
  return mapping
}

const addUrlQuery = (url = '', query = {}, options = {}) => {
  const result = queryString.parseUrl(url)
  
  if (options.keepQuery) {
    result.query = {
      ...result.query,
      ...query
    }
  } else {
    result.query = query
  }

  return `${result.url}?${queryString.stringify(result.query)}`
}

export const appendPJson = (value = '', options = {}) => {
  return addUrlQuery(value, { f: 'json' }, options)
}

//经纬度转墨卡托
export const lonlat2mercator = lonlat => {
  const mercator = { x: 0, y: 0 }
  let x = lonlat.x * 20037508.34 / 180
  let y = Math.log(Math.tan((90 + lonlat.y) * Math.PI / 360)) / (Math.PI / 180)
  y = y * 20037508.34 / 180
  mercator.x = x
  mercator.y = y
  return mercator
}

//墨卡托转经纬度
export const mercator2lonlat = mercator => {
  const lonlat = { x: 0, y: 0 }
  let x = mercator.x / 20037508.34 * 180
  let y = mercator.y / 20037508.34 * 180
  y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2)
  lonlat.x = x
  lonlat.y = y
  return lonlat
}

// 获得地图服务的 json 信息
const MAP_SERVICE_JSON_CACHE = {}
export const getMapServiceJSONDetails = (url, options) => {
  const match = MAP_SERVICE_JSON_CACHE[url]
  options = Object.assign({}, {
    cache: true,
    validate: true
  }, options)
  const promise = (options.cache && match)
    ? Promise.resolve(match)
    : fetch(`${url}?f=pjson`)
        .catch(e => { throw new Error('无法获取地图服务信息') })
        .then(r => r.json())
        .catch(e => { throw new Error('地图服务信息解析出错') })

  return promise.then(r => {
    if (options.validate) {
      const errorMessage = validateMapService(r)
      if (errorMessage) {
        throw new Error(errorMessage)
      }
    }
    return MAP_SERVICE_JSON_CACHE[url] = r
  }).catch(e => {
    MAP_SERVICE_JSON_CACHE[url] = null
    throw e
  })
}

export const isValidToken = (mapServerUrl = '', token = '') => {
  if (isPBSMapService(mapServerUrl)) {
    return Promise.resolve(true)
  } else {
    const url = addUrlQuery(mapServerUrl, { f: 'pjson', token }, { keepQuery: false })
    return fetch(url).then(r => r.json()).then(r => {
      return !r.error
    }).catch(e => false)
  }
}

export const isPBSMapService = (mapServerUrl = '') => {
  return mapServerUrl.includes('/PBS/')
}

/**
 * 判断地图服务是否需要授权
 * @param {String} mapServerUrl 
 */
export const isMapServicePrivate = (mapServerUrl = '') => {
  if (isPBSMapService(mapServerUrl)) {
    return Promise.resolve(false)
  } else {
    return fetch(appendPJson(mapServerUrl, { keepQuery: false })).then(r => r.json()).then(r => {
      return !!(r.error && r.error.code === 499) // r.error.message === 'Token Required'
    }).catch(e => false)
  }
}

// 验证地图服务的有效性
// 有效：http://47.93.76.207:6080/arcgis/rest/services/hpsb/project/MapServer
// 无效：http://47.93.76.207:6080/arcgis/rest/services/hpsb/project/MapServer/<n>
// export const validateMapService = json => !!json.layers
export const validateMapService = json => {
  if (!json.layers) {
    return '无效地图服务地址'
  } else if (json.layers && json.layers.length > MAX_SUBLAYERS) {
    return `子图层数量不能超过${MAX_SUBLAYERS}`
  } else if (!json.spatialReference || !isValidWkid(json.spatialReference.wkid)) {
    return '无效wkid值'
  } else {
    return ''
  }
}

// 自动判断图层类型
export const getMapServiceLayerType
  = json => !!json.tileInfo ? MAP_LAYER_TYPES.TILED.value : MAP_LAYER_TYPES.DYNAMIC.value

// 获取一个 dynamic 图册中的可高级配置的子图层
// 满足条件的自图层是：没有自图层的图层（subLayerIds === null）
export const getSubLayers = (layerJSONDetails = {}) => {
  return (layerJSONDetails.layers || []).filter(layer => !layer.subLayerIds)
}

// 获取图层的可查询字段
// field { name, alias, domain, type }
export const getSubLayerFields = url => getMapServiceJSONDetails(url, { validate: false }).then(r => r.fields)

export const isValidWkid = wkid => VALID_WKIDS.includes(wkid)

// create dynamic layer or tiled layer by mapServer Url
// layer: { type, mapServerUrl, visibility }
export const createLayerFromServerUrl = constructorMapping => ({ id, type, mapServerUrl }) => {
  const { DynamicMapServiceLayer, TiledMapServiceLayer } = constructorMapping
  const DynamicLayerConstructor =
    type === MAP_LAYER_TYPES.DYNAMIC.value
    ? DynamicMapServiceLayer
    : TiledMapServiceLayer

  const dynamicLayer = new DynamicLayerConstructor(mapServerUrl, { id })
  return dynamicLayer
}

export const removeLayer = ({ map, layerId }) => {
  const layer = map.getLayer(layerId)
  layer && map.removeLayer(layer)
}

export const showLayer = ({ map, layerId }) => {
  const layer = map.getLayer(layerId)
  layer && layer.setVisibility(true)
}

export const hideLayer = ({ map, layerId }) => {
  const layer = map.getLayer(layerId)
  layer && layer.setVisibility(false)
}

export const extentToLayer = ({ map, layerId }) => {
  const layer = map.getLayer(layerId)
  layer && map.setExtent(layer.fullExtent)
}

export const isLayerVisible = ({ map, layerId }) => {
  const layer = map.getLayer(layerId)
  return layer && layer.visible
}

export const getMapExtent = ({ map }) => {
  return map.extent
}

export const setMapExtent = ({ map, extent }) => {
  map.setExtent(extent)
}

/* graphics */
export const createTextSymbolGraphic = constructorMapping => ({ text, point, font, color, offset = [0, 0] }) => {
  const { TextSymbol, Font, Color, Graphic } = constructorMapping
  const txtSymbol = new TextSymbol(
    text,
    font || new Font('18',  Font.STYLE_ITALIC, Font.VARIANT_NORMAL, Font.WEIGHT_NORMAL, 'Courier'),
    color || new Color([0, 255, 0])
  )
  txtSymbol.setOffset(...offset)
  return new Graphic(point, txtSymbol)
}

export const getCenterOfGeometry = constructorMapping => (geometry) => {
  const { Point, Extent } = constructorMapping
  if (geometry.type === 'point') {
    return geometry
  } else {
    const ext = geometry.getExtent()
    return new Point((ext.xmin + ext.xmax) / 2, (ext.ymin + ext.ymax) / 2, geometry.spatialReference)
  }
}
