// search tree node by key, and execute callback
export const findNodeByKey = (data, key, callback, options = { keyPropName: 'key', childrenPropName: 'children' }) => {
  data.forEach((item, index, arr) => {
    if (item[options.keyPropName] == key) {
      return callback(
        item,   // tree node
        index,  // index in this level
        arr     // all other tree node in the same level
      )
    }
    if (item[options.childrenPropName]) {
      return findNodeByKey(item[options.childrenPropName], key, callback, options)
    }
  })
}

export const buildTree = (flatData = [], options = { key: 'id', parentKey: 'parent' }) => {
  const KEY = options.key
  const PARENT_KEY = options.parentKey

  function process (value) {
    const children = []
    for (let i = 0; i < flatData.length; i++) {
      const node = flatData[i]
      if (node[PARENT_KEY] === value) {
        children.push(Object.assign(Object.create(null), node, { children: process(node[KEY]) }))
      }
    }
    return children.length > 0 ? children : null
  }


  return flatData
    .filter(d => !d[PARENT_KEY])
    .map(d => Object.assign(Object.create(null), d, { children: process(d[KEY]) }))
}

export const walk = (treeData, callback, options = { childrenPropName: 'children' }) => {
  let loopContext = {}
  const childrenPropName = options.childrenPropName || 'children'

  const loop = (tData, parentItem, ck) => {
    tData.forEach(item => {
      const skipChildren = ck(item, parentItem, loopContext)
      if (skipChildren !== false && item[childrenPropName]) {
        loop(item[childrenPropName || 'children'], item, ck)
      }
      ck(item, parentItem, loopContext, 'beforeNextSibling')
    })
  }

  loop(treeData, null, callback)
  loopContext = null
}

export const getTreeKeysToLevel = (treeData, level) => {
  const treeKeys = []
  //-1：全部 0：none
  if (level !== 0) {
    const iterate = (current, depth) => {
      if (level === -1) {
        treeKeys.push(current.key)
      } else if (depth < level) {
        treeKeys.push(current.key)
      } else if (depth >= level){
        return
      }
      current.children && current.children.forEach(item => iterate(item, depth + 1))
    }
    treeData.forEach(item => iterate(item, 0));
  }

  return treeKeys
}

export const getPathToNode = (node, path, func) => {
  path.push(node)
  if(func(node)) {
    return true
  }
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      if (getPathToNode(node.children[i], path, func)) {
        return true
      }
    }
  }
  path.pop()
  return false
}
