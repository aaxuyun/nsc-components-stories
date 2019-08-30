import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { Button, message, Tag, Select } from 'antd'
import Table from '@/components/Table'
import { datetimeFormat } from '@/utils/format'
import { getCvtLabel } from '@/utils/cvt'
import * as userAPI from '@/apis/users'
import * as departmentUserAPI from '@/apis/department-users'
import TooltipButton from '@/lib/components/TooltipButton'
import EditUserModal from '@/containers/modals/admin/user/EditUser'
import CvtValueSelectorAutoFetch from '@/components/cvt/CvtValueSelectorAutoFetch'
import SetPasswordModal from '@/containers/modals/admin/user/SetPassword'
import confirm from '@/components/confirm'
import { noop } from '@/utils/func'
import UserDrawer from '@/containers/drawers/UserDrawer'

const { Option } = Select

class UserList extends Component {
  clickDeleteHandler = (user) => {
    const { onDeleted } = this.props
    confirm({
      title: '删除确认',
      content: `确认删除该人员：${user.name}`,
      onOk: () => {
        userAPI.destroy(user.id)
          .then(() => {
            message.success('删除成功')
            onDeleted()
          })
          .catch(() => message.error('删除失败'))
      }
    })
  }

  clickRecycleHandler = (user) => {
    const { onRecycled } = this.props
    confirm({
      title: '还原确认',
      content: `确认还原该人员：${user.name}`,
      onOk: () => {
        userAPI.update({
          id: user.id,
          isDeleted: 0
        })
        .then(() => {
          message.success('还原成功')
          onRecycled()
        })
        .catch(() => message.error('还原失败'))
      }
    })
  }

  clickDisableHandler = (user, type) => {
    const { onDisabled } = this.props
    let text = '解禁'
    if (type === 1) {
      text = '禁用'
    }

    confirm({
      title: `${text}确认`,
      content: `确认${text}该人员：${user.name}`,
      onOk: () => {
        userAPI.update({
          id: user.id,
          status: type
        })
        .then(() => {
          message.success(`${text}成功`)
          onDisabled()
        })
        .catch(() => message.error(`${text}失败`))
      }
    })
  }

	clickMsgVerifyHandler = (user, msgVerify) => {
    const { onMsgVerify } = this.props
    let text = '不需要'
    if (msgVerify === '1') {
      text = '需要'
    }

    confirm({
      title: `短信验证确认`,
      content: `确认该人员${user.name} ${text} 验证`,
      onOk: () => {
        userAPI.updateUserExt({
          userId: user.id,
          msgVerify
        })
        .then(() => {
          message.success(`修改成功`)
          onMsgVerify()
        })
        .catch(() => message.error(`修改失败`))
      }
    })
  }

	handlePositionChange = (value, record) => {
		const { projectId, department, onEdited } = this.props
		departmentUserAPI.updatePosition(projectId, department.id, record.id, value)
		.then(r => {
      message.success('岗位设置成功')
			onEdited()
    })
		.catch(() => message.error('岗位设置失败'))
	}

  render () {
    const {
      listData,
      pagination, // { current, total, pageSize, onChange(page, pageSize) }
      displayColumns,
      onEdited,
      enabledActions,
      keyField,
      ...restProps
    } = this.props

    const columns = [
      { key: 'username', title: '登录名', dataIndex: 'username', render: (v, r) => <UserDrawer id={r.id}>{v}</UserDrawer> },
      { key: 'name', title: '姓名', dataIndex: 'name' },
      { key: 'gender', title: '性别', dataIndex: 'gender', render: v => getCvtLabel(v, 'GENDER')},
      { key: 'company', title: '单位', dataIndex: 'company', render: v => v ? v.name : '' },
			{ key: 'jobPost', title: '岗位',dataIndex: 'jobPost', render: (v, r, i) => {
					return <CvtValueSelectorAutoFetch
            style={{ width: '100%' }}
            placeholder='选择岗位'
            cvtType='base'
            cvtCode='USER_JOB_POST'
            value={v}
            onChange={ (value) => this.handlePositionChange(value, r) }
          />
				}
			},
      { key: 'telephone', title: '电话', dataIndex: 'telephone' },
      { key: 'createdAt', title: '注册时间', dataIndex: 'createdAt', render: v => datetimeFormat(v) },
      { key: 'status', title: '状态', dataIndex: 'status', render: (v, r, i) => {
        return (
          v === 0
          ? <Tag onClick={() => this.clickDisableHandler(r, 1)}>正常</Tag>
          : <Tag color="red" onClick={() => this.clickDisableHandler(r, 0)}>已禁用</Tag>
        )}
      },
			{ key: 'msgVerify', title: '是否验证', dataIndex: 'msgVerify', render: (v, r, i) => {
        return (
          r.msgVerify === '1'
          ? <Tag onClick={() => this.clickMsgVerifyHandler(r, 0)}>是</Tag>
          : <Tag color="red" onClick={() => this.clickMsgVerifyHandler(r, 1)}>否</Tag>
        )}
      },
      { key: 'opts', title: '操作', dataIndex: 'opts', render: (v, r, i) => {
        const actions = [
          { key: 'recycle', component: <TooltipButton key={`recycle-${i}`} icon="rollback" tip="还原" onClick={() => this.clickRecycleHandler(r)} /> },
          { key: 'password', component: <SetPasswordModal key={`password-${i}`} userData={r}><TooltipButton icon="lock" tip="修改密码" /></SetPasswordModal> },
          { key: 'edit', component: <EditUserModal key={`edit-${i}`} userData={r} onEdited={onEdited}><TooltipButton icon="edit" tip="编辑" /></EditUserModal> },
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

      } }, // 还原，密码，编辑，禁用，删除
    ].filter(c => {
      if (displayColumns[0] === '*') {
        return true
      } else {
        return displayColumns.includes(c.key)
      }
    })

    return (
      <div>
        <Table
          rowKey={r => r[keyField]}
          columns={columns}
          dataSource={listData}
          pagination={pagination}
          {...restProps}
        />
      </div>
    )
  }
}

UserList.propTypes = {
	projectId: PropTypes.string,
	department: PropTypes.object,
  keyField: PropTypes.string,
  listData: PropTypes.array.isRequired,
  pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  displayColumns: PropTypes.array.isRequired, // columns key here
  enabledActions:  PropTypes.array,
  onDeleted: PropTypes.func,
  onEdited: PropTypes.func,
  onRecycled: PropTypes.func,
  onDisabled: PropTypes.func,
	onMsgVerify: PropTypes.func
}

UserList.defaultProps = {
  keyField: 'id',
  listData: [],
  pagination: false,
  displayColumns: ['*'],  // default to display all columns
  enabledActions: ['*'],
  onDeleted: noop,
  onEdited: noop,
  onRecycled: noop,
  onDisabled: noop,
	onMsgVerify: noop
}

export default UserList
