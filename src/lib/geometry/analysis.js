import _ from 'lodash'
import { loadModules } from 'esri-loader'
import { ArcGIS_JS_API } from '@/constants/urls'
import { measureAngle } from './utils'

const URL_OPTION = {
  url: ArcGIS_JS_API
}

const URL_NOT_EXIST = '当前工程未开通此分析功能，请联系管理员开通'
const ELEVATION_PROFILE_URL = 'https://elevation.arcgis.com/arcgis/rest/services/Tools/ElevationSync/GPServer'

export const setCorsEnabledServer = (urls) => {
  return loadModules([
    "esri/config"
  ], URL_OPTION)
  .then(([esriConfig]) => {
    urls.forEach(url => esriConfig.defaults.io.corsEnabledServers.push(url))
  })
}

export const getGeometryLength = (geoObject, option) => {
  return loadModules([
    'esri/graphic',
    'esri/geometry/webMercatorUtils',
    'esri/geometry/geometryEngine'
  ], URL_OPTION)
  .then(([Graphic, webMercatorUtils, geometryEngine]) => {
    const graphic = new Graphic(geoObject)
    let geometry = graphic.geometry
    if(geometry.spatialReference.wkid == 102100){
      geometry = webMercatorUtils.webMercatorToGeographic(geometry)
    }
    return geometryEngine.geodesicLength(geometry, option)
  })
}

export const getGeometryArea = (geoObject, option) => {
  return loadModules([
    'esri/graphic',
    'esri/geometry/webMercatorUtils',
    'esri/geometry/geometryEngine'
  ], URL_OPTION)
  .then(([Graphic, webMercatorUtils, geometryEngine]) => {
    const graphic = new Graphic(geoObject)
    let geometry = graphic.geometry
    if(geometry.spatialReference.wkid == 102100){
      geometry = webMercatorUtils.webMercatorToGeographic(geometry)
    }
    return Math.abs(geometryEngine.geodesicArea(geometry, option)) // counter-clockwise polygon would have a negative area value
  })
}

export const getLineInfo = (geoObject) => {
  return loadModules([
    "esri/graphic",
    "esri/geometry/webMercatorUtils",
    "esri/geometry/geodesicUtils",
    "esri/units",
    "esri/geometry/Polyline",
    "esri/SpatialReference",
  ], URL_OPTION)
  .then(([Graphic, webMercatorUtils, geodesicUtils, Units, Polyline, SpatialReference]) => {
    const graphic = new Graphic(geoObject)
    const lineinfo = {}
    let polyline = graphic.geometry
    if(polyline.spatialReference.wkid == 102100){
      polyline = webMercatorUtils.webMercatorToGeographic(polyline)
    }

    const cornerCount = polyline.paths[0].length
    lineinfo.cornerCount = cornerCount
    const segmentLines = []
    const points = []
    points.push(polyline.getPoint(0, 0))
    for (let i = 1; i < cornerCount; i++) {
      points.push(polyline.getPoint(0, i))
      const line = new Polyline(new SpatialReference({wkid:4326}));
      line.addPath([]);
      line.insertPoint(0, 0, polyline.getPoint(0, i - 1))
      line.insertPoint(0, 1, polyline.getPoint(0, i))
      segmentLines.push(line)
    }

    const lineLengths = geodesicUtils.geodesicLengths(segmentLines, Units.KILOMETERS);
    lineinfo.segments = []
    lineinfo.segments.push({
      forwardAngle: 0,
      sumLength: 0,
      length: 0,
      lon: points[0].x,
      lat: points[0].y
    })
    let totalLength = 0
    lineLengths.forEach((length, i, arr) => {
      let angle = 0
      if (i < cornerCount - 2) {
        angle = 180 - measureAngle(points[i], points[i + 1], points[i + 2])
      }
      totalLength += length
      lineinfo.segments.push({
        forwardAngle: angle,
        sumLength: totalLength,
        length,
        lon: points[i + 1].x,
        lat: points[i + 1].y
      })
    })
    lineinfo.totalLength = totalLength

    const straightLine = new Polyline(new SpatialReference({wkid:4326}))
    straightLine.addPath([])
    straightLine.insertPoint(0, 0, points[0])
    straightLine.insertPoint(0, 1, points[cornerCount - 1])
    const straightLength = geodesicUtils.geodesicLengths([straightLine], Units.KILOMETERS)[0]
    lineinfo.curvature = totalLength/straightLength
    return lineinfo
  })
}

export const getCrossDistricts = (geoObject, option) => {
  return loadModules([
    "esri/graphic",
    "esri/geometry/webMercatorUtils",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/geometry/geometryEngine"
  ], URL_OPTION)
  .then(([Graphic, webMercatorUtils, Query, QueryTask, geometryEngine]) => {
    const graphic = new Graphic(geoObject)
    let polyline = graphic.geometry
    if(polyline.spatialReference.wkid == 102100){
      polyline = webMercatorUtils.webMercatorToGeographic(polyline)
    }

    const totalLength = geometryEngine.geodesicLength(polyline, 'kilometers')
    const urlObject = option.urls.find(item => item.type === 'COUNTY_DISTRICT')
    if (!urlObject || !urlObject.url) {
      throw URL_NOT_EXIST
    }
    const task = new QueryTask(urlObject.url)
    const query = new Query()
    query.geometry = polyline
    query.returnGeometry = true
    query.outFields = ["shengm", "shim", "xianm"]
    return task.execute(query).promise.then(result => {
      const countyObjects = result.features
      const provinces = _.groupBy(countyObjects, 'attributes.shengm')
      const lineinfo = {}
      lineinfo.districts = Object.keys(provinces).map((provinceName) => {
        const provinceObject = {}
        provinceObject.name = provinceName
        const currentCitys = provinces[provinceName]
        const directCounties = currentCitys.filter(item => !_.trim(item.attributes.shim))
        .map(county => {
          const countyObject = {}
          countyObject.name = county.attributes.xianm
          const intersectGeo = geometryEngine.intersect(polyline, county.geometry)
          countyObject.intersectLength = geometryEngine.geodesicLength(intersectGeo, "kilometers")
          countyObject.lengthPercent = countyObject.intersectLength/totalLength
          return countyObject
        })
        const cities = _.groupBy(currentCitys.filter(item => _.trim(item.attributes.shim)), 'attributes.shim')
        const directCities = Object.keys(cities).map((cityName) => {
          const cityObject = {}
          cityObject.name = cityName
          cityObject.children = cities[cityName].map(county => {
            const countyObject = {}
            countyObject.name = county.attributes.xianm
            const intersectGeo = geometryEngine.intersect(polyline, county.geometry)
            countyObject.intersectLength = geometryEngine.geodesicLength(intersectGeo, "kilometers")
            countyObject.lengthPercent = countyObject.intersectLength/totalLength
            return countyObject
          })
          return cityObject
        })
        provinceObject.children = [...directCounties, ...directCities]
        return provinceObject
      })

      const reconcilePercent = (node) => {
        const summedCountOfChildren = node.children.reduce((_summedCount, childNode) => {
          const childCount = childNode.children && childNode.children.length > 0 ? reconcilePercent(childNode) : childNode.lengthPercent
          return _summedCount + (childCount || 0)
        }, 0)
        node.lengthPercent = summedCountOfChildren
        return node.lengthPercent
      }
      lineinfo.districts.forEach(reconcilePercent)

      const reconcileLength = (node) => {
        const summedCountOfChildren = node.children.reduce((_summedCount, childNode) => {
          const childCount = childNode.children && childNode.children.length > 0 ? reconcileLength(childNode) : childNode.intersectLength
          return _summedCount + (childCount || 0)
        }, 0)
        node.intersectLength = summedCountOfChildren
        return node.intersectLength
      }
      lineinfo.districts.forEach(reconcileLength)

      lineinfo.totalLength = totalLength
      return lineinfo
    })
  })
}

export const getCrossIcePolluted = (geoObject, option) => {
  return loadModules([
    "esri/graphic",
    "esri/geometry/webMercatorUtils",
    "dojo/promise/all",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/geometry/geometryEngine"
  ], URL_OPTION)
  .then(([Graphic, webMercatorUtils, all, Query, QueryTask, geometryEngine]) => {
    const graphic = new Graphic(geoObject)
    let polyline = graphic.geometry
    if(polyline.spatialReference.wkid == 102100){
      polyline = webMercatorUtils.webMercatorToGeographic(polyline)
    }

    const tasks = ['ICE_AREA', 'POLLUTED_AREA'].map(type => {
      const urlObject = option.urls.find(item => item.type === type)
      if (!urlObject || !urlObject.url) {
        throw URL_NOT_EXIST
      }
      const task = new QueryTask(urlObject.url)
      const query = new Query()
      query.geometry = polyline
      query.returnGeometry = true
      query.outFields = ["VALUE"]
      return task.execute(query).promise
    })

    const totalLength = geometryEngine.geodesicLength(polyline, 'kilometers')
    return all(tasks).then(results => {
      const areaGraphics = results.map(r => r.features)
      const lineinfo = {}
      lineinfo.areas = areaGraphics.map((area, index) => {
        const areaObject = {}
        if (index === 0) {
          areaObject.name = '冰区'
        } else {
          areaObject.name = '污区'
        }
        areaObject.children = area.map(item => {
          const itemObject = {}
          itemObject.name = item.attributes.VALUE
          const intersectGeo = geometryEngine.intersect(polyline, item.geometry)
          itemObject.intersectLength = geometryEngine.geodesicLength(intersectGeo, "kilometers")
          itemObject.lengthPercent = itemObject.intersectLength/totalLength
          return itemObject
        })

        areaObject.intersectLength = 0
        areaObject.lengthPercent = 0
        areaObject.children.forEach((item, i, arr) => {
          areaObject.intersectLength += item.intersectLength
          areaObject.lengthPercent += item.lengthPercent
        })
        return areaObject
      })

      lineinfo.totalLength = totalLength
      return lineinfo
    })
  })
}

export const getCrossPowerline = (geoObject, option) => {
  return loadModules([
    "esri/graphic",
    "esri/geometry/webMercatorUtils",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/geometry/geometryEngine"
  ], URL_OPTION)
  .then(([Graphic, webMercatorUtils, Query, QueryTask, geometryEngine]) => {
    const graphic = new Graphic(geoObject)
    let polyline = graphic.geometry
    if(polyline.spatialReference.wkid == 102100){
      polyline = webMercatorUtils.webMercatorToGeographic(polyline)
    }

    const totalLength = geometryEngine.geodesicLength(polyline, 'kilometers')
    const urlObject = option.urls.find(item => item.type === 'POWER_LINE')
    if (!urlObject || !urlObject.url) {
      throw URL_NOT_EXIST
    }
    const task = new QueryTask(urlObject.url)
    const query = new Query()
    query.geometry = polyline
    query.returnGeometry = true
    query.outFields = ["VALUE", "NAME"]
    return task.execute(query).promise.then(result => {
      const powerlineGraphics = result.features
      const grades = _.groupBy(powerlineGraphics, 'attributes.VALUE')
      const lineinfo = {}
      lineinfo.powerlines = Object.keys(grades).map((key) => {
        const gradeObject = {}
        gradeObject.name = key
        gradeObject.children = grades[key].map(item => ({ name: item.attributes.NAME }) )
        return gradeObject
      })
      lineinfo.powerlines = _.sortBy(lineinfo.powerlines, [ o => { return -o.name.length }])
      lineinfo.totalLength = totalLength
      return lineinfo
    })
  })
}

export const getLineCrossedGobjs = (lineGobj, gobjs = []) => {
  return loadModules([
    'esri/graphic',
    'esri/geometry/geometryEngine'
  ], URL_OPTION).then(([Graphic, geometryEngine]) => {
    const lineGeometry = new Graphic(lineGobj.geometryJson).geometry
    const geometries = gobjs.map(gobj => new Graphic(gobj.geometryJson).geometry)
    const indexes = []
    for (let i = 0; i < geometries.length; i++) {
      if (geometryEngine.intersects(lineGeometry, geometries[i])){
        indexes.push(i)
      }
    }
    return indexes.map(index => gobjs[index])
  })
}

export const createElevationProfileWidget = (map, domId, callback) => {
  return loadModules([
    "esri/dijit/ElevationProfile",
    "esri/units",
    "dojo/dom",
    "dojo/on"
  ], URL_OPTION)
  .then(([ElevationsProfileWidget, Units, dom, on]) => {
    const chartOptions = {
      titleFontColor: "#4638ff",
      axisFontColor: "#312bff",
      sourceTextColor: "red",
      busyIndicatorBackgroundColor: "#666"
    }

    const profileParams = {
      map: map,
      chartOptions: chartOptions,
      profileTaskUrl: ELEVATION_PROFILE_URL,
      scalebarUnits: Units.KILOMETERS
    }

    const epWidget = new ElevationsProfileWidget(profileParams, typeof domId === 'string' ? dom.byId(domId) : domId )
    epWidget.startup()
    epWidget.resize()

    on(epWidget, 'load', evt => {
      callback(epWidget)
    })
  })
}

export const setElevationProfileGeometry = (epWidget, geometry) => {
  return loadModules([
    "esri/geometry/Polyline",
  ], URL_OPTION)
  .then(([Polyline]) => {
    const polyline = new Polyline(geometry)
    epWidget.set("profileGeometry", polyline)
    epWidget.resize()
  })
}

export const getLineTopoRatio = (geoObject, option) => {
  // remove the deduplicated point from each path
  geoObject.geometry.paths.forEach((path, index) => {
    geoObject.geometry.paths[index] = _.uniqWith(path, (a, b) => a[0] === b[0] && a[1] === b[1])
  })

  return loadModules([
    "esri/graphic",
    'esri/geometry/geometryEngine',
    "esri/request"
  ], URL_OPTION)
  .then(([Graphic, geometryEngine, esriRequest]) => {
    const graphic = new Graphic(geoObject)
    const polyline = graphic.geometry

    const minLength = 0.3
    const maxLength = 500
    const totalLength = geometryEngine.geodesicLength(polyline, 'kilometers')
    if (totalLength < minLength) {
      throw `当前路径距离过短，无法进行分析`
    } else if (totalLength > maxLength) {
      throw `当前路径距离过长，如需计算请联系管理员`
    }

    const urlObject = option.urls.find(item => item.type === 'TOPORATIO_LAYER')
    if (!urlObject || !urlObject.url) {
      throw URL_NOT_EXIST
    }

    const params = {
			url: urlObject.url,
			content: {
    		lineid: "line",
    		linejson: JSON.stringify(polyline),
    		f: "json"
    	},
			handleAs: "json",
			callbackParamName: "callback"
  	}
    return esriRequest(params).then(result => {
      const lineinfo = {}
      const landformResult = []
  		const sumLength = result.PD + result.QL + result.SD + result.GS + result.JL
  		const PDPercent = result.PD / sumLength
      const PDLength = PDPercent * totalLength
      landformResult.push({ name: "平地", percent: PDPercent, length: PDLength })
      const QLPercent = result.QL / sumLength
      const QLLength = QLPercent * totalLength
      landformResult.push({ name: "丘陵", percent: QLPercent, length: QLLength })
      const SDPercent = result.SD / sumLength
      const SDLength = SDPercent * totalLength
      landformResult.push({ name: "山地", percent: SDPercent, length: SDLength })
      const GSPercent = result.GS / sumLength
      const GSLength = GSPercent * totalLength
      landformResult.push({ name: "高山", percent: GSPercent, length: GSLength })
      const JLPercent = result.JL / sumLength
      const JLLength = JLPercent * totalLength
      landformResult.push({ name: "峻岭", percent: JLPercent, length: JLLength })

      lineinfo.landform = landformResult
      lineinfo.totalLength = totalLength
      return lineinfo
    })
  })
}

export const getGeometriesExtent = (geoObjects, { pointRadius = 1000, factor = 1.5 }) => {
  return loadModules([
    "esri/graphic",
    "esri/geometry/Extent"
  ], URL_OPTION)
  .then(([Graphic, Extent]) => {
    const geometryExtents = geoObjects
    .map(item => new Graphic(item).geometry)
    .map(item => {
      let geoExtent = item.getExtent()
      if (!geoExtent) {
        geoExtent = new Extent(item.x - pointRadius, item.y - pointRadius, item.x + pointRadius, item.y + pointRadius, item.spatialReference)
      }
      return geoExtent
    })

    let fullExtent = geometryExtents[0]
    for (let i = 1; i < geometryExtents.length; i++) {
      fullExtent = fullExtent.union(geometryExtents[i])
    }
    fullExtent = fullExtent.expand(factor)
    return fullExtent
  })
}

export const elevationMeasure = (map, option) => {
  return loadModules([
    "esri/geometry/webMercatorUtils",
    "esri/request"
  ], URL_OPTION)
  .then(([webMercatorUtils, esriRequest]) => {
    const urlObject = option.urls.find(item => item.type === 'ELEVATION_LAYER')
    if (!urlObject || !urlObject.url) {
      throw URL_NOT_EXIST
    }

    const showInfoWindow = (evt, elevation) => {
      const latitude = evt.mapPoint.getLatitude()
      const longitude = evt.mapPoint.getLongitude()
      map.infoWindow.resize(150, 90)
      map.infoWindow.setTitle("高程信息")
      map.infoWindow.setContent(
        elevation
        ? `经 度(°): ${longitude.toFixed(5)}<br>纬 度(°): ${latitude.toFixed(5)}<br>高 程(m): ${elevation}`
        : `经 度(°): ${longitude.toFixed(5)}<br>纬 度(°): ${latitude.toFixed(5)}`
      )
      map.infoWindow.show(evt.mapPoint, map.getInfoWindowAnchor(evt.screenPoint))
    }

    const moveHandler = map.on('mouse-move', evt => {
      showInfoWindow(evt)
    })

    const clickHandler = map.on('click', evt => {
      map.infoWindow.hide()
      let point = evt.mapPoint
      if(point.spatialReference.wkid == 102100){
        point = webMercatorUtils.webMercatorToGeographic(point)
      }
      const params = {
        url: urlObject.url,
        content: {
          geometry:JSON.stringify(point),
          geometryType:"esriGeometryPoint",
          returnGeometry:true,
          returnCatalogItems:false,
          f: "json"
        },
        handleAs: "json",
        callbackParamName: "callback"
      }

      esriRequest(params).then(result => {
        if (result.value === 'NoData') {
          result.value = '无数据'
        }
        showInfoWindow(evt, result.value)
      }, err => {
        showInfoWindow(evt, '高程获取失败')
      })
    })
    return [moveHandler, clickHandler]
  })
}
