import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tree } from 'antd'
import LayerTreeItem from './LayerTreeItem'

const TreeNode = Tree.TreeNode

// add/edit/remove category
// add/edit/remove layer
// reorder category/layer
// toggle layers
// locate layers
class LayerTree extends Component {

  expandHandler = (expandedKeys) => {
    const { dispatch } = this.props
    dispatch({
      type: 'project_layers/changeExpandedKeys',
      payload: { keys: expandedKeys }
    })
  }

  renderTreeNodeTitle (layer) {
    const { expandedKeys, onLayerCategoryEdited, onLayerCategoryDeleted, onLayerEdited, onLayerCreated, onLayerDeleted, onLayerAdded, onDoubleClick } = this.props
    return (
      <LayerTreeItem
        data={layer}
        expanded={expandedKeys.includes(layer.id)}
        onLayerCategoryEdited={onLayerCategoryEdited}
        onLayerCategoryDeleted={onLayerCategoryDeleted}
        onLayerEdited={onLayerEdited}
        onLayerCreated={onLayerCreated}
        onLayerDeleted={onLayerDeleted}
        onLayerAdded={onLayerAdded}
        onDoubleClick={onDoubleClick}
      />
    )
  }

  render () {
    const { layers } = this.props

    const loop = layers => layers.map(layer => {
      if (layer.type === 'category') {
        return (
          <TreeNode key={layer.id} title={this.renderTreeNodeTitle(layer)} dataRef={layer}>
            {loop(layer.children || [])}
          </TreeNode>
        )
      }

      return <TreeNode key={layer.id} title={this.renderTreeNodeTitle(layer)} isLeaf={true} dataRef={layer} />
    })

    return (
      <Tree
        checkable={false}
        onExpand={this.expandHandler}
      >
        {loop(layers)}
      </Tree>
    )
  }
}

LayerTree.propTypes = {
  onLayerCreated: PropTypes.func,
  onLayerCategoryEdited: PropTypes.func,
  onLayerCategoryDeleted: PropTypes.func,
  onLayerEdited: PropTypes.func,
  onLayerDeleted: PropTypes.func,
  onLayerAdded: PropTypes.func,
  onDoubleClick: PropTypes.func,
}

export default connect(state => ({
  layers: state['project_layers'].layerTreeData,  // [{ id, name, type, children }]
  expandedKeys: state['project_layers'].expandedKeys
}))(LayerTree)
