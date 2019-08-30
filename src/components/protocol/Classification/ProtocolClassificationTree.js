import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tree, Button, Icon } from 'antd'
import { noop } from '@/utils/func'
import { isEqual, cloneDeep, omit } from 'lodash'
import { findNodeByKey } from '@/utils/tree'

const TreeNode = Tree.TreeNode

const transformProtocol = obj => {
  obj.key = obj.id
  obj.type = 'protocol'
  return obj
}

class ProtocolClassificationTree extends Component {
  mergeFoldersAndProtocols (folders, protocols) {
    const cloneFolders = cloneDeep(folders)

    protocols.forEach(protocol => {
      findNodeByKey(cloneFolders, protocol.level, folder => {
        if (folder.children) {
          folder.children.push(transformProtocol(protocol))
        } else {
          folder.children = [transformProtocol(protocol)]
        }
      })
    })

    return cloneFolders
  }

  renderTreeNodeTitle (item) {
    const { expandedKeys} = this.props
    if (item.type === 'protocol') {
      return (
        <span>
          <Icon type='file' />
          {' ' + item.name}
        </span>
      )
    } else {
      const expanded = expandedKeys.includes(item.key)
      return (
        <span>
          <Icon type={expanded ? 'folder-open' : 'folder'} />
          {' ' + item.name}
        </span>
      )
    }
  }

	renderTreeNodes = (data) => {
    return data.map((item) => {
      return (
        <TreeNode title={this.renderTreeNodeTitle(item)} key={item.key} isLeaf={item.type === 'protocol' || (item.children && item.children.length === 0)} dataRef={item}>
          {item.children && this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    })
  }

  render () {
    const { folders, protocols, ...restProps } = this.props
    const treeData = this.mergeFoldersAndProtocols(folders, protocols)

    return (
      <Tree {...restProps}>
         {this.renderTreeNodes(treeData)}
      </Tree>
    )
  }
}

ProtocolClassificationTree.propTypes = {
  folders: PropTypes.array.isRequired, // [{ id, name, type(department|folder|gobjType|gobjSubType), parentId }]
  protocols: PropTypes.array.isRequired,  // [{ id, name, folder, department, gobjType, gobjSubType }]
  // other Tree props
}

ProtocolClassificationTree.defaultProps = {
  folders: [],
  protocols: [],
}

export default ProtocolClassificationTree
