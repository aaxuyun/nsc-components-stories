import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DistrictSelectorAutoFetch from './DistrictSelectorAutoFetch'
import * as departmentAPI from '@/apis/departments'
import * as projectAPI from '@/apis/projects'

// DistrictSelector specified for department form
class DepartmentDistrictSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      parentDeptDistId: null,
      projectProvinceIds: []
    }
  }

  componentDidMount () {
    this.fetch()
  }

  fetch () {
    const { department, projectId } = this.props
    if (department.parentId) {
      departmentAPI.get(department.parentId).then(r => {
        this.setState({ parentDeptDistId: r.districts.length > 0 ? r.districts[0].id : null })
      })
    }

    projectAPI.get(projectId).then(r => this.setState({ projectProvinceIds: r.projectDist || [] }))
  }

  render () {
    const { department, ...rest } = this.props
    const { projectProvinceIds } = this.state

    return (
      <DistrictSelectorAutoFetch
        {...rest}
        parentId={this.state.parentDeptDistId}
        level={department.type - 1}
        whiteList={{ provinces: projectProvinceIds }}
      />
    )
  }
}

DepartmentDistrictSelectorAutoFetch.propsTypes = {
  department: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired
}

DepartmentDistrictSelectorAutoFetch.defaultProps = {
  department: {}
}

export default DepartmentDistrictSelectorAutoFetch
