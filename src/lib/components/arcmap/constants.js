// extend of china
export const EXTENT_OF_CHINA = ({ Extent, SpatialReference }) => new Extent(8003262.609569005, 2123114.89764850, 14964535.649554726, 5889931.65154085, new SpatialReference({ wkid:102100 }))

// base map types
export const BASE_MAP_TYPES = {
  // TIANDI_SATE: { value: 'tiandi_satellite', label: '天地图卫星影像' },
  TIANDI_2D: { value: 'tiandi_2d', label: '电子地图' },
  GOOGLE_SATE: { value: 'google_satellite', label: '卫星影像' },
  // GOOGLE_2D: { value: 'google_2d', label: '谷歌电子地图' },
}

// arcgis 添加图层类型
export const MAP_LAYER_TYPES = {
  DYNAMIC: { value: 'dynamic', label: '动态图层' },
  TILED: { value: 'tiled', label: '切片图层' }
}

// 做图层配置的时候，对添加的图层 mapServerUrl 的 wkid 进行校验
export const VALID_WKIDS = [3857, 102100, 4326]

// 运行子图层的最大数量
export const MAX_SUBLAYERS = 30
