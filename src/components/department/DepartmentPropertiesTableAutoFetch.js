import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PropertiesTable from '@/lib/components/PropertiesTable'
import * as departmentAPI from '@/apis/departments'
import { DEPARTMENT_LABELS } from '@/constants/labels'
import * as companyAPI from '@/apis/companies'

class DepartmentPropertiesTable extends Component {

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
    departmentAPI.get(this.props.id).then(r => {
			const { companyId, parentId } = r
      companyId && companyAPI.get(companyId).then(company => {
        this.setState({ data: {...this.state.data, companyName: company.name }})
      })
      parentId && departmentAPI.get(parentId).then(dept => {
        this.setState({ data: {...this.state.data, parentName: dept.name }})
      })

      this.setState({
        data: r,
        loading: false
      })
    }).catch(err => {
      this.setState({ loading: false })
    })
  }

  render () {
    const { loading, data } = this.state
    return <PropertiesTable properties={data || {}} labelMapping={DEPARTMENT_LABELS} loading={loading} />
  }
}

DepartmentPropertiesTable.propTypes = {
  id: PropTypes.string.isRequired
}

export default DepartmentPropertiesTable
