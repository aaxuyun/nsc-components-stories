import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tree } from 'antd'
import { buildTree } from '@/utils/tree'
import { noop } from '@/utils/func'

const { TreeNode } = Tree

class LayerTree extends Component {

  constructor (props) {
    super(props)
    this.state = {
      value: props.value || []
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value })
    }
  }

  checkHandler = (checkedKeys) => {
    const { onChange } = this.props
    this.setState({ value: checkedKeys })
    onChange(checkedKeys)
  }

  renderTreeNodes (data) {
    return data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      } else {
        return <TreeNode title={item.name} key={item.id} />
      }
    })
  }

  render () {
    const { layerTypes, layerList } = this.props
    const typesInTree = buildTree(layerTypes, { key: 'id', parentKey: 'parentId' })
    return (
      <Tree
        showLine
        checkable
        checkedKeys={this.state.value}
        onCheck={this.checkHandler}
        defaultExpandedKeys={['0-0']}
      >
        <TreeNode title="全部" key="0-0">
          {this.renderTreeNodes(typesInTree)}
        </TreeNode>
      </Tree>
    )
  }
}

LayerTree.propTypes = {
  layerTypes: PropTypes.array.isRequired,
  layerList: PropTypes.array.isRequired,
  onChange: PropTypes.func
}

LayerTree.defaultProps = {
  layerTypes: [],
  layerList: [],
  onChange: noop
}

export default LayerTree
