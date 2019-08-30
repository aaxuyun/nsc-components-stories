import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import TooltipButton from '@/lib/components/TooltipButton'
import Table from '@/components/Table'
import confirm from '@/components/confirm'
import EditDepartmentModal from '@/containers/modals/project/department/EditDepartment'
import { noop } from '@/utils/func'
import * as departmentAPI from '@/apis/departments'
import DepartmentDrawer from '@/containers/drawers/DepartmentDrawer'

class DepartmentList extends Component {

  clickDeleteHandler = (dept) => {
    const { onDeleted } = this.props
    confirm({
      title: '删除确认',
      content: `确认删除该部门：${dept.name}`,
      onOk: () => {
        departmentAPI.destroy(dept.id)
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
      projectId,
      onEdited,
			displayColumns,
			enabledActions,
      ...restProps
    } = this.props
    const columns = [
      { key: 'name', title: '部门名称', dataIndex: 'name', render: (v, r) => <DepartmentDrawer id={r.id}>{v}</DepartmentDrawer> },
      { key: 'companyName', title: '所属单位', dataIndex: 'company', render: v => v ? v.name : '' },
      { key: 'role', title: '部门角色', dataIndex: 'role', render: v => v ? v.name : '' },
      { key: 'sortNo', title: '排序号', dataIndex: 'sortNo' },
      { key: 'opts', title: '操作', dataIndex: 'opts', render: (v, r, i) => {
				const actions = [
          { key: 'edit', component: <EditDepartmentModal key={`edit-${i}`} projectId={projectId} departmentData={r} onEdited={onEdited}><TooltipButton icon="edit" tip="编辑" /></EditDepartmentModal> },
					{ key: 'delete', component: <TooltipButton key={`delete-${i}`} icon="delete" type="danger" tip="删除" onClick={() => this.clickDeleteHandler(r)} /> },
        ].filter(c => {
          if (enabledActions[0] === '*') {
            return true
          } else {
            return enabledActions.includes(c.key)
          }
        })
        return actions.map( item => {
          return item.component
        })

      } }
    ].filter(c => {
      if (displayColumns[0] === '*') {
        return true
      } else {
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

DepartmentList.propTypes = {
	displayColumns: PropTypes.array,
	enabledActions: PropTypes.array,
  onEdited: PropTypes.func,
  onDeleted: PropTypes.func,
	onDeptConfig: PropTypes.func
}

DepartmentList.defaultProps = {
	displayColumns: ['*'],
	enabledActions: ['*'],
  onEdited: noop,
  onDeleted: noop,
	onDeptConfig: noop
}

export default DepartmentList
