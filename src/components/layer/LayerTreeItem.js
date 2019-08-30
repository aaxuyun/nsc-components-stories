import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Button, message } from 'antd'
import ContextMenu from '@/lib/components/context-menu/ContextMenu'
import CreateBaseLayerModal from '@/containers/modals/project/layer/CreateBaseLayers'
import AddBaseLayerModal from '@/containers/modals/project/layer/AddBaseLayer'
import EditLayerModal from '@/containers/modals/project/layer/EditLayer'
import EditLayerCategoryModal from '@/containers/modals/project/layer/EditLayerCategory'
import confirm from '@/components/confirm'
import { noop } from '@/utils/func'
import * as layerCategoryAPI from '@/apis/layer-categories'
import * as mayLayerAPI from '@/apis/map-layers'


class LayerTreeItem extends Component {

  constructor (props) {
    super(props)
    this.state = {
      addLayerModalVisible: false,
      createLayerModalVisible: false,
      editLayerModalVisible: false,
      createLayerCategoryModalVisible: false,
      editLayerCategoryModalVisible: false
    }
  }

  doubleClickHandler = data => {
    const { onDoubleClick } = this.props
    onDoubleClick && onDoubleClick(data)
  }

  deleteLayerCategory () {
    layerCategoryAPI.destroy(this.props.data.id).then(() => {
      message.success('删除成功')
      this.props.onLayerCategoryDeleted()
    }).catch(() => message.error('删除失败'))
  }

  deleteLayer () {
    mayLayerAPI.destroy(this.props.data.id).then(() => {
      message.success('移除成功')
      this.props.onLayerDeleted()
    }).catch(() => message.error('移除失败'))
  }

  menuClickHandler = (key) => {
    if (key === 'editLayer') {
      this.setState({ editLayerModalVisible: true })
    } else if (key === 'deleteLayer') {
      confirm({
        title: '移除确认',
        content: `确认移除图层[${this.props.data.name}]`,
        onOk: () => this.deleteLayer()
      })
    } else if (key === 'createLayer') {
      this.setState({ createLayerModalVisible: true })
    } else if (key === 'addLayer') {
      this.setState({ addLayerModalVisible: true })
    } else if (key === 'editLayerCategory') {
      this.setState({ editLayerCategoryModalVisible: true })
    } else if (key === 'addLayerCategory') {
      this.setState({ createLayerCategoryModalVisible: true })
    } else if (key === 'deleteLayerCategory') {
      confirm({
        title: '删除确认',
        content: `确认删除图层分类[${this.props.data.name}]`,
        onOk: () => this.deleteLayerCategory()
      })
    }
    this.props.onContextMenuClick(key, this.props.data)
  }

  handleLayerCategoryEdited = () => {
    this.setState({ editLayerCategoryModalVisible: false })
    this.props.onLayerCategoryEdited()
  }

  handleLayerCreated= () => {
    this.setState({ createLayerModalVisible: false })
    this.props.onLayerCreated()
  }

  handleLayerAdded = () => {
    this.setState({ addLayerModalVisible: false })
    this.props.onLayerAdded()
  }

  handleLayerEdited = () => {
    this.setState({ editLayerModalVisible: false })
    this.props.onLayerEdited()
  }

  // action: edit, delete
  renderLayerItem () {
    const { data } = this.props
    const menus = [
      { key: 'editLayer', title: <span><Icon type="edit" /> 编辑图层</span> },
      'divider',
      { key: 'deleteLayer', title: <span><Icon type="delete" /> 移除图层</span> },
    ]
    return (
      <ContextMenu menus={menus} onMenuClick={this.menuClickHandler}>
        <span><Icon type="file" /> {data.name}</span>
      </ContextMenu>
    )
  }

  renderCategoryItem () {
    const { data, expanded } = this.props
    const menus = [
      { key: 'createLayer', title: <span><Icon type="plus" /> 新建图层</span> },
      { key: 'addLayer', title: <span><Icon type="download" /> 导入图层</span> },
      { key: 'editLayerCategory', title: <span><Icon type="edit" /> 编辑分类</span> },
      'divider',
      { key: 'deleteLayerCategory', title: <span><Icon type="delete" /> 删除分类</span> },
    ]
    return (
      <ContextMenu menus={menus} onMenuClick={this.menuClickHandler}>
        <span><Icon type={expanded ? 'folder-open' : 'folder'} /> {data.name}</span>
      </ContextMenu>
    )
  }

  render () {
    const { data } = this.props
    const { createLayerModalVisible, addLayerModalVisible, editLayerModalVisible, createLayerCategoryModalVisible, editLayerCategoryModalVisible } = this.state

    return (
      <span onClick={e => e.stopPropagation()} onDoubleClick={() => this.doubleClickHandler(data)} >
        {data.type === 'category' ? this.renderCategoryItem() : this.renderLayerItem()}
				<CreateBaseLayerModal
          trigger={false}
          visible={createLayerModalVisible}
          layerData={{ projectId: data.projectId, deptId: data.deptId, category: data.id  }}
          onCreated={this.handleLayerCreated}
          onCancel={() => this.setState({ createLayerModalVisible: false })}
        />
        <AddBaseLayerModal
          trigger={false}
          visible={addLayerModalVisible}
          layerData={{ projectId: data.projectId, deptId: data.deptId, category: data.id  }}
          onAdded={this.handleLayerAdded}
          onCancel={() => this.setState({ addLayerModalVisible: false })}
        />
        <EditLayerModal
          trigger={false}
          visible={editLayerModalVisible}
          layerData={{ id: data.id }}
          onEdited={this.handleLayerEdited}
          onCancel={() => this.setState({ editLayerModalVisible: false })}
        />
        <EditLayerCategoryModal
          trigger={false}
          visible={editLayerCategoryModalVisible}
          layerCategoryData={data}
          onEdited={this.handleLayerCategoryEdited}
          onCancel={() => this.setState({ editLayerCategoryModalVisible: false })}
        />
      </span>
    )
  }
}

LayerTreeItem.propTypes = {
  data: PropTypes.object,
  expanded: PropTypes.bool,
  onContextMenuClick: PropTypes.func,
  onLayerCategoryEdited: PropTypes.func,
  onLayerCategoryDeleted: PropTypes.func,
  onLayerEdited: PropTypes.func,
  onLayerDeleted: PropTypes.func,
  onLayerAdded: PropTypes.func,
  onLayerCreated: PropTypes.func,
  onDoubleClick: PropTypes.func,
}

LayerTreeItem.defaultProps = {
  onLayerCreated: noop,
  onContextMenuClick: noop,
  onLayerCategoryEdited: noop,
  onLayerCategoryDeleted: noop,
  onLayerEdited: noop,
  onLayerDeleted: noop,
  onLayerAdded: noop,
  onDoubleClick: noop,
}

export default LayerTreeItem
