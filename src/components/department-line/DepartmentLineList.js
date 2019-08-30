import { Component } from "react";
import Table from '@/components/Table'
import PropTypes from 'prop-types'
import { noop } from '@/utils/func'
import { message, Icon } from 'antd'
import TooltipButton from '@/lib/components/TooltipButton'
import confirm from '@/components/confirm'
import * as departmentLineAPI from '@/apis/department-line'
import AddDepartment from '@/containers/modals/project/department-line/AddDepartment'

class DepartmentLineList extends Component{

  clickDeleteHandler = (r) => {
    const { onReload } = this.props
    confirm({
      title: '取消关联确认',
      content: `确认取消关联该部门：${r.name}`,
      onOk: () => {
        departmentLineAPI.destroy(r.deptLineId)
          .then(() => {
            message.success('取消成功')
            onReload && onReload()
          })
          .catch(() => message.error('取消失败'))
      }
    })
  }

  clickCreateHandler = (r) => {
    const { fetchAllowedDepartments } = this.props
    fetchAllowedDepartments && fetchAllowedDepartments(r)
  }
   
  columnsOperate = (t, r, i) => {
    const { onReload, projectId } = this.props
  
    const createAction = [
			<AddDepartment key={`create-${i}`} projectId={projectId} onReload={onReload}>
        <TooltipButton icon="file-add" tip="添加" type="primary" onClick={() => this.clickCreateHandler(r)}/>
      </AddDepartment>
    ]

    const deleteAction = [
      <TooltipButton key={`delete-${i}`} icon="delete" tip="删除" type="danger" onClick={() => this.clickDeleteHandler(r)} />
    ]

    if (r.roleId) {
      return deleteAction
    }else{
      return createAction
    }
  }

  columnsList = () => {
    const { displayColumns } = this.props
    const columns = [
      { title: '部门类型', dataIndex: 'role', render: v => v ? v.name : '' },
      { title: '部门名称', dataIndex: 'name' },
      { title: '单位名称', dataIndex: 'company', render: v => v ? v.name : '' },
      { title: '操作', dataIndex: 'operate', render: this.columnsOperate },
    ].filter((column) => {
      if (displayColumns[0] === '*') {
        return true
      }
      return displayColumns.includes(column.dataIndex)
    })
    return columns
  }

  render () {
    const { listData, pagination, keyField, ...restProps } = this.props
    return (
      <Table
          rowKey={r => r[keyField]}
          columns={this.columnsList()}
          dataSource={listData}
          pagination={pagination}
          {...restProps}
        />
    )
  }
}

DepartmentLineList.propTypes = {
  listData: PropTypes.array.isRequired,
  pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
}

DepartmentLineList.defaultProps = {
  onSwitchLine: () => {},
  onPaginationChange: () => {},

  keyField: 'id',
  listData: [],
  pagination: false,
  displayColumns: ['*'],  // default to display all columns
  onDeleted: noop,
  onEdited: noop,
  onRecycled: noop,
  onDisabled: noop,
	onMsgVerify: noop
}

export default DepartmentLineList