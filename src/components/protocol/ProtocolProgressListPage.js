import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from "dva"
import { Button } from 'antd'
import ProtocolProgressList from '@/components/protocol/ProtocolProgressList'
import { noop } from '@/utils/func'
import * as protocolProgressAPI from '@/apis/protocol-progress'
import CreateProtocolProgressModal from '@/containers/modals/workbench/protocol/CreateProtocolProgress'
import PageToolbar from '@/components/page/PageToolbar'
import * as districtAPI from '@/apis/districts'

class ProtocolProgressListPage extends Component {
  constructor (props) {
    super(props)
		this.state = {
      listData: [],
			totalPage: 0,
      total: 0,
      page: 1,
			pageSize: 10,
			provinceList: []
    }
  }

  componentDidMount () {
		this.fetchProvinceList()
    this.fetchProtocolList()
  }

  fetchProvinceList () {
    districtAPI.provinces().then(r => this.setState({ provinceList: r || [] }))
  }

  fetchProtocolList (pagination = { page: 1, pageSize: 10 }) {
		const { deptId, currentProject } = this.props
    const projectId = currentProject.id

    const request = ({
			projectId: projectId,
			deptId: deptId
		})

		protocolProgressAPI.list(request, pagination)
		.then(r => {
			this.setState({
				listData: r.list ? r.list : [],
				page: r.meta.page ? r.meta.page : 1,
				pageSize: r.meta.pageSize ? r.meta.pageSize : 10,
				totalPage: r.meta.totalPage ? r.meta.totalPage : 0,
				total: r.meta.total ? r.meta.total : 0,
			})
		})
	}

  paginationChangeHandler = (page, pageSize) => {
    this.fetchProtocolList({ page, pageSize })
  }

  render () {
    const { listData, page, total, pageSize, provinceList } = this.state
		const { deptId, currentProject } = this.props
		const rightTools = [
      <CreateProtocolProgressModal
				key={1}
				deptId={deptId}
				onCreated = {() => this.fetchProtocolList()}
			>
        <Button type="primary" icon="plus">新建</Button>
      </CreateProtocolProgressModal>
    ]

    return (
      <div style={{height: '100%', overflow: 'auto'}}>
				<PageToolbar rightTools={rightTools} />
        <ProtocolProgressList
          listData={listData}
					provinceList={provinceList}
          pagination={{
            current: page,
            total,
            pageSize,
            onChange: this.paginationChangeHandler
          }}
					onDeleted = {() => this.fetchProtocolList()}
					onEdited = {() => this.fetchProtocolList()}
        />
      </div>
    )
  }
}

ProtocolProgressListPage.propTypes = {
}

ProtocolProgressListPage.defaultProps = {
}

export default connect(state => ({
  currentProject: state['app'].currentProject,
}))(ProtocolProgressListPage)
