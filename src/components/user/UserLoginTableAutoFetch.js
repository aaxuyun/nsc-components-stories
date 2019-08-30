import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as userAPI from '@/apis/users'
import Table from '@/components/Table'

class UserLoginTable extends Component {

  constructor (props) {
    super(props)
    this.state = {
      data: [],
			page: 1,
			pageSize: 10,
			total: 0,
    }
  }

  componentDidMount () {
    this.fetch()
  }

	fetch(pagination = {page: 1, pageSize: 10}) {
		userAPI.getUserLoginLogs(this.props.id,pagination)
		.then(r => {
			this.setState({
				data: r.list,
				page: r.meta.page ,
				pageSize: r.meta.pageSize,
				total: r.meta.total,
			})
		})
	}

	paginationChangeHandler = (page, pageSize) => {
    this.fetch({ page, pageSize })
  }

  render () {
		const { data, page, pageSize, total } = this.state

    const columns = [
      { key: 'loginTime', title: '登录时间', dataIndex: 'loginTime' },
    ]

    return (
      <div>
				<div style={{marginBottom: 5}}>{`共计登录${total}次`}</div>
        <Table
          rowKey={r => r.id}
          size='small'
          columns={columns}
          dataSource={data}
					pagination={{
						hideOnSinglePage: true,
						current: page,
						total,
						pageSize,
						onChange: this.paginationChangeHandler
					}}
					locale={{emptyText: '无'}}
        />
      </div>
    )
  }
}

UserLoginTable.propTypes = {
  id: PropTypes.string.isRequired
}

export default UserLoginTable
