import pathToRegexp from 'path-to-regexp'

export const getMatchedMenuItem = (menus, url) => {
  let items = []
  const getFlatMenuItems = (menus, parent) => {
    menus.forEach(item => {
      if (item.children) {
        getFlatMenuItems(item.children, item)
      } else {
        items.push({
          ...item,
          parentKey: parent? parent.key: ''
        })
      }
    })
    return items
  }
  getFlatMenuItems(menus)
  const match = items.find(item => pathToRegexp(item.link).test(url))

  if (!match) {
    console.warn('cannot match current href with admin sidebar menu item links', url)
    return {}
  }

  return match
}

export const getWindowSize = () => {
  const width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth

  const height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight

  return { width, height }
}
