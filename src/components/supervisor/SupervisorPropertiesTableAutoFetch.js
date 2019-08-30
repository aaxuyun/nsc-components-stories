import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PropertiesTable from '@/lib/components/PropertiesTable'
import * as supervisorAPI from '@/apis/supervisors'
import * as departmentAPI from '@/apis/departments'
import * as departmentUserAPI from '@/apis/department-users'
import { SUPERVISOR_LABELS } from '@/constants/labels'

class SupervisorPropertiesTableAutoFetch extends Component {

  constructor (props) {
    super(props)
    this.state = {
      data: null,
      loading: true
    }
  }

  componentDidMount () {
    this.fetch()
  }

  fetch () {
    this.setState({ loading: true })
    supervisorAPI.get(this.props.id).then(r => {
			departmentAPI.list({projectId: r.projectId}).then(result => {
        departmentUserAPI.getManagerUsers(r.rDeptIds)
        .then(userList => {
          const userIds = r.rUserIds !== null && r.rUserIds.split(',')
          r.rUserIds = userIds && userIds.map(item => {
            const user = userList.find(user => user.id === item)
            return user ? user.name : ''
          }).join(', ')
          const departments = result.list
          const deptIds = r.rDeptIds.split(',')
          r.rDeptIds = deptIds.map(item => {
            const dept = departments.find(dept => dept.id === item)
            return dept ? dept.name : ''
          }).join(', ')
          const sDeptId = departments.find(data => data.id === r.sDeptId)
          r.sDeptId = sDeptId ? sDeptId.name : ''
          r.state = "已阅"
          this.setState({
            data: r,
            loading: false
          })
        })
			})
    }).catch(err => {
      this.setState({ loading: false })
    })
  }

  render () {
    const { loading, data } = this.state
    return <PropertiesTable properties={data || {}} labelMapping={SUPERVISOR_LABELS} loading={loading} />
  }
}

SupervisorPropertiesTableAutoFetch.propTypes = {
  id: PropTypes.string.isRequired
}

export default SupervisorPropertiesTableAutoFetch
