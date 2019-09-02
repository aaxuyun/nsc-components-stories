"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPathToNode = exports.getTreeKeysToLevel = exports.walk = exports.buildTree = exports.findNodeByKey = void 0;

// search tree node by key, and execute callback
var findNodeByKey = function findNodeByKey(data, key, callback) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    keyPropName: 'key',
    childrenPropName: 'children'
  };
  data.forEach(function (item, index, arr) {
    if (item[options.keyPropName] == key) {
      return callback(item, // tree node
      index, // index in this level
      arr // all other tree node in the same level
      );
    }

    if (item[options.childrenPropName]) {
      return findNodeByKey(item[options.childrenPropName], key, callback, options);
    }
  });
};

exports.findNodeByKey = findNodeByKey;

var buildTree = function buildTree() {
  var flatData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    key: 'id',
    parentKey: 'parent'
  };
  var KEY = options.key;
  var PARENT_KEY = options.parentKey;

  function process(value) {
    var children = [];

    for (var i = 0; i < flatData.length; i++) {
      var node = flatData[i];

      if (node[PARENT_KEY] === value) {
        children.push(Object.assign(Object.create(null), node, {
          children: process(node[KEY])
        }));
      }
    }

    return children.length > 0 ? children : null;
  }

  return flatData.filter(function (d) {
    return !d[PARENT_KEY];
  }).map(function (d) {
    return Object.assign(Object.create(null), d, {
      children: process(d[KEY])
    });
  });
};

exports.buildTree = buildTree;

var walk = function walk(treeData, callback) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    childrenPropName: 'children'
  };
  var loopContext = {};
  var childrenPropName = options.childrenPropName || 'children';

  var loop = function loop(tData, parentItem, ck) {
    tData.forEach(function (item) {
      var skipChildren = ck(item, parentItem, loopContext);

      if (skipChildren !== false && item[childrenPropName]) {
        loop(item[childrenPropName || 'children'], item, ck);
      }

      ck(item, parentItem, loopContext, 'beforeNextSibling');
    });
  };

  loop(treeData, null, callback);
  loopContext = null;
};

exports.walk = walk;

var getTreeKeysToLevel = function getTreeKeysToLevel(treeData, level) {
  var treeKeys = []; //-1：全部 0：none

  if (level !== 0) {
    var iterate = function iterate(current, depth) {
      if (level === -1) {
        treeKeys.push(current.key);
      } else if (depth < level) {
        treeKeys.push(current.key);
      } else if (depth >= level) {
        return;
      }

      current.children && current.children.forEach(function (item) {
        return iterate(item, depth + 1);
      });
    };

    treeData.forEach(function (item) {
      return iterate(item, 0);
    });
  }

  return treeKeys;
};

exports.getTreeKeysToLevel = getTreeKeysToLevel;

var getPathToNode = function getPathToNode(node, path, func) {
  path.push(node);

  if (func(node)) {
    return true;
  }

  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      if (getPathToNode(node.children[i], path, func)) {
        return true;
      }
    }
  }

  path.pop();
  return false;
};

exports.getPathToNode = getPathToNode;