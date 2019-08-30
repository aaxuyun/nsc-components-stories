import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PropertiesTable from '@/lib/components/PropertiesTable'
import * as usertAPI from '@/apis/users'
import { USER_LABELS } from '@/constants/labels'

class UserPropertiesTable extends Component {

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
    usertAPI.get(this.props.id).then(r => {
      if ('gender' in r) {
        r.gender === 0 ? r.gender = '男' : r.gender = '女'
      }
      if ('role' in r) {
        r.role === 1 ? r.role = '普通用户' : r.role = '管理员'
      }
      if ('company' in r) {
        r.company.name && (r.company = r.company.name)
      }

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
    return <PropertiesTable properties={data || {}} labelMapping={USER_LABELS} loading={loading} />
  }
}

UserPropertiesTable.propTypes = {
  id: PropTypes.string.isRequired
}

export default UserPropertiesTable
