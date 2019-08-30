import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import TooltipButton from '@/lib/components/TooltipButton'
import Table from '@/components/Table'
import confirm from '@/components/confirm'
import EditBaseLayerModal from '@/containers/modals/admin/layer/EditBaseLayer'
import PreviewBaseLayerModal from '@/containers/modals/admin/layer/PreviewBaseLayer'
import { noop } from '@/utils/func'
import * as baselayerAPI from '@/apis/base-layers'

class BaseLayerList extends Component {

  clickDeleteHandler = (proj) => {
    const { onDeleted } = this.props
    confirm({
      title: '删除确认',
      content: `确认删除该图层：${proj.name}`,
      onOk: () => {
        baselayerAPI.destroy(proj.id)
        .then(() => {
          message.success('删除成功')
          onDeleted()
        })
        .catch(() => message.error('删除失败'))
      }
    })
  }

  render () {
		const { MAP_LAYER_TYPE } = window.CVT
    const {
      listData = [],
			baseLayerCateList = [],
      pagination, // { current, total, pageSize, onChange(page, pageSize) }
      onEdited,
      enabledActions,
      displayColumns,
      ...restProps
    } = this.props

    const columns = [
      { key: 'name', title: '图层名称', dataIndex: 'name' },
			{ key: 'categoryId', title: '图层类别', dataIndex: 'categoryId', render: v => {
				const cate = baseLayerCateList.filter( item => item.id === v )[0]
				return cate && cate.name ? cate.name : null
			}},
      { key: 'type', title: '图层类型', dataIndex: 'type', render: v => {
				const layer = Object.values(MAP_LAYER_TYPE).filter(item => item.value === v)
				return layer[0] ? layer[0].value2 : null
			}},
			{ key: 'remark', title: '注释', dataIndex: 'remark' },
      { key: 'opts', title: '操作', dataIndex: 'opts', render: (v, r, i) => {
        const actions = [
          {key : "recycle", component : <TooltipButton  key={`recycle-${i}`} icon="rollback" tip="还原" onClick={() => this.clickRecycleHandler(r)} />},
          {key : "preview", component : <PreviewBaseLayerModal key={`preview-${i}`} layer={r}><TooltipButton icon="tag-o" tip="预览" /></PreviewBaseLayerModal>},
          {key : "edit", component : <EditBaseLayerModal  key={`edit-${i}`} formData={r} onEdited={onEdited}><TooltipButton icon="edit" tip="编辑" /></EditBaseLayerModal>},
          {key : "delete", component : <TooltipButton key={`delete-${i}`} icon="delete" type="danger" tip="删除" onClick={() => this.clickDeleteHandler(r)} />}
        ].filter( c => {
          if(enabledActions[0]==='*'){
            return true
          }else{
            return enabledActions.includes(c.key)
          }
        })
        return actions.map( item => {
          return item.component
        })
      } }
    ].filter( c => {
      if(displayColumns[0]==='*'){
        return true
      }else{
        return displayColumns.includes(c.key)
      }
    })

    return (
      <Table
        rowKey={r => r.id}
        columns={columns}
        dataSource={listData}
        pagination={pagination}
        {...restProps}
      />
    )
  }
}

BaseLayerList.propTypes = {
  listData: PropTypes.array.isRequired,
  onEdited: PropTypes.func,
  onDeleted: PropTypes.func,
  onRecycled: PropTypes.func,
  enabledActions: PropTypes.array,
  displayColumns: PropTypes.array
}

BaseLayerList.defaultProps = {
  listData: [],
  onEdited: noop,
  onDeleted: noop,
  onRecycled: noop,
  enabledActions: ['*'],
  displayColumns: ['*']
}

export default BaseLayerList
