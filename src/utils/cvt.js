export const getCvtLabel = (key, cvtValues /* or code */) => {
  if (typeof cvtValues === 'string') {
    const code = cvtValues
    return window.CVT[code] && window.CVT[code][key] ? window.CVT[code][key].value : key
  } else {
    const match = cvtValues.filter(item => item.key === key)[0]
    return match ? match.value : key
  }
}

export const cacheCvts = (projectId, cvts) => {
  const cacheKey = projectId || 'base'
  return window.CVT_CACHE[cacheKey] = cvts
}

export const getCvts = projectId => {
  const cacheKey = projectId || 'base'
  return window.CVT_CACHE[cacheKey]
}

export const updateCache = (projectId, cvt) => {
  const cache = getCvts(projectId)
  if (cache) {
    cache[cvt.code][cvt.key] = cvt
    window.CVT = cache
  }
}

export const deleteCache = (projectId, { code, key }) => {
  const cache = getCvts(projectId)
  if (cache) {
    delete cache[code][key]
    window.CVT = cache
  }
}
