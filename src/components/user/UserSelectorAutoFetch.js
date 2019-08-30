import React, { Component } from 'react'
import { Select } from 'antd'
import * as departmentUserAPI from '@/apis/department-users'

const { Option } = Select

class UserSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listData: []
    }
  }

  componentDidMount () {
    const { selectedDepartment } = this.props
    if( selectedDepartment.length > 0 ){
      this.fetchList(selectedDepartment)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDepartment !== this.props.selectedDepartment) {
      this.fetchList(nextProps.selectedDepartment)
    }
  }

  fetchList (selectedDepartment) {
    departmentUserAPI.getManagerUsers(selectedDepartment.join(','))
    .then(list => {
      this.setState({ listData: list })
    })
  }

  render () {
    const { listData } = this.state
    return (
      <Select
        {...this.props}
        mode="multiple"
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
      >
        {listData.length > 0 && listData.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
      </Select>
    )
  }
}

UserSelectorAutoFetch.propTypes = {
}

UserSelectorAutoFetch.defaultProps = {
}

export default UserSelectorAutoFetch
