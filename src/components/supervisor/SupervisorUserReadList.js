import React, { Component } from 'react'
import { Tag } from 'antd'
import PropTypes from 'prop-types'
import Table from '@/components/Table'
import TextEllipsis from '@/lib/components/TextEllipsis'
import { noop } from '@/utils/func'
import styles from './Supervisor.css'

class SupervisorUserReadList extends Component {

  render () {
    const {
      listData = [],
      pagination, // { current, total, pageSize, onChange(page, pageSize) }
			displayColumns,
      ...restProps
    } = this.props

    const columns = [
      { key: 'name', title: '接收部门', dataIndex: 'name'},
      { key: 'username', title: '已读用户', dataIndex: 'userList', render: (v, r) => {
				let usernames = []
				if (r && r.userList) {
					r.userList.filter(item => item.isRead === 1).map(item => {
						usernames.push(item.userName+' ('+item.updatedAt+')')
					})
					return usernames.length > 0 ? usernames.map(item => <div>{item}</div>) : <Tag color="red">无人已读</Tag>
				} else {
					return <Tag color="red">无人已读</Tag>
				}
			}},
    ].filter(c => {
      if (displayColumns[0] === '*') {
        return true
      } else {
        return displayColumns.includes(c.key)
      }
    })
    return (
			<div className={styles.supervisorTable}>
				<Table
					rowKey={r => r.id}
					size="small"
					columns={columns}
					dataSource={listData}
					{...restProps}
				/>
			</div>
    )
  }
}

SupervisorUserReadList.propTypes = {
	displayColumns: PropTypes.array,
}

SupervisorUserReadList.defaultProps = {
	displayColumns: ['*'],
}

export default SupervisorUserReadList
