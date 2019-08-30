import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, message } from 'antd'
import TooltipButton from '@/lib/components/TooltipButton'
import Table from '@/components/Table'
import confirm from '@/components/confirm'
import EditProjectModal from '@/containers/modals/admin/project/EditProject'
import { noop } from '@/utils/func'
import * as projectAPI from '@/apis/projects'
import ProjectDrawer from '@/containers/drawers/ProjectDrawer'

class ProjectList extends Component {
  clickDeleteHandler = (proj) => {
    const { onDeleted } = this.props
    confirm({
      title: '删除确认',
      content: `确认删除该工程：${proj.name}`,
      onOk: () => {
        projectAPI.destroy(proj.id)
          .then(() => {
            message.success('删除成功')
            onDeleted()
          })
          .catch(() => message.error('删除失败'))
      }
    })
  }

  clickRecycleHandler = (proj) => {
    const { onRecycled } = this.props
    confirm({
      title : '还原确认',
      content : `确认还原工程 : ${proj.name}`,
      onOk : () => {
        projectAPI.update({
          id : proj.id,
          isDeleted : 0
        }).then( () => {
          message.success('还原成功')
          onRecycled()
        }).catch( () =>
          message.error('还原失败')
        )
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
      { key: 'name', title: '工程名称', dataIndex: 'name', render: (v, r) => <ProjectDrawer id={r.id}>{v}</ProjectDrawer> },
      { key: 'shortName', title: '工程简称', dataIndex: 'shortName' },
      { key: 'voltageLevel', title: '电压等级', dataIndex: 'voltageLevel', render: v => window.CVT.VOLTAGE_LEVEL[v] ? window.CVT.VOLTAGE_LEVEL[v].value : '' },
      { key: 'lineLength', title: '线路长度', dataIndex: 'lineLength' },
      { key: 'sectionCount', title: '标段总量', dataIndex: 'sectionCount' },
      { key: 'opts', title: '操作', dataIndex: 'opts', render: (v, r, i) => {
        const actions = [
          {key : "recycle", component : <TooltipButton key={`recycle-${i}`} icon="rollback" tip="还原" onClick={() => this.clickRecycleHandler(r)} />},
          {key : "edit", component : <EditProjectModal key={`edit-${i}`} projectData={r} onEdited={onEdited}><TooltipButton icon="edit" tip="编辑" /></EditProjectModal>},
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
      } },
      { key: 'manage', title: '管理后台', dataIndex: 'manage', render: (v, r) => {
        return(
          <Button.Group>
            <Button onClick={() => window.location.href=`#/projects/${r.id}/departments`}>管理台</Button>
            <Button type='primary' onClick={() => window.open(`#/workbench/${r.id}/design/sections`)}>操作台</Button>
          </Button.Group>
        )}
      }

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

ProjectList.propTypes = {
  listData: PropTypes.array.isRequired,
  onEdited: PropTypes.func,
  onDeleted: PropTypes.func,
  onRecycled: PropTypes.func,
  enabledActions: PropTypes.array,
  displayColumns: PropTypes.array
}

ProjectList.defaultProps = {
  listData: [],
  onEdited: noop,
  onDeleted: noop,
  onRecycled: noop,
  enabledActions: ['*'],
  displayColumns: ['*']
}

export default ProjectList
