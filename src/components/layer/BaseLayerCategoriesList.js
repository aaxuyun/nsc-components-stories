import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Button, message } from 'antd'
import TooltipButton from '@/lib/components/TooltipButton'
import Table from '@/components/Table'
import confirm from '@/components/confirm'
import PreviewBaseLayer from '@/containers/modals/admin/layer/PreviewBaseLayer'
import EditBaseLayerCategoriesModal from '@/containers/modals/admin/layer/EditBaseLayerCategories'
import { noop } from '@/utils/func'
import * as baseLayerCategoriesAPI from '@/apis/base-layer-categories'

class BaseLayerCategoriesList extends Component {
	
  clickDeleteHandler = (proj) => {
    const { onDeleted } = this.props
    confirm({
      title: '删除确认',
      content: `确认删除该图层类型：${proj.name}`,
      onOk: () => {
        baseLayerCategoriesAPI.destroy(proj.id)
        .then(() => {
          message.success('删除成功')
          onDeleted()
        })
        .catch(() => message.error('删除失败'))
      }
    })
  }

  render () {
    const {
      listData = [],
      pagination, // { current, total, pageSize, onChange(page, pageSize) }
      onEdited,
      enabledActions,
      displayColumns,
      ...restProps
    } = this.props

    const columns = [
      { key: 'name', title: '图层分类名称', dataIndex: 'name' },
			{ key: 'sortNo', title: '排序号', dataIndex: 'sortNo' },
      { key: 'opts', title: '操作', dataIndex: 'opts', render: (v, r, i) => {
        const actions = [
          {key : "recycle", component : <TooltipButton  key={`recycle-${i}`} icon="rollback" tip="还原" onClick={() => this.clickRecycleHandler(r)} />},
          {key : "edit", component : <EditBaseLayerCategoriesModal  key={`edit-${i}`} formData={r} onEdited={onEdited}><TooltipButton icon="edit" tip="编辑" /></EditBaseLayerCategoriesModal>},
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

BaseLayerCategoriesList.propTypes = {
  listData: PropTypes.array.isRequired,
  onEdited: PropTypes.func,
  onDeleted: PropTypes.func,
  onRecycled: PropTypes.func,
  enabledActions: PropTypes.array,
  displayColumns: PropTypes.array
}

BaseLayerCategoriesList.defaultProps = {
  listData: [],
  onEdited: noop,
  onDeleted: noop,
  onRecycled: noop,
  enabledActions: ['*'],
  displayColumns: ['*']
}

export default BaseLayerCategoriesList
