import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { departmentRoleList } from '@/apis/roles'
import { noop } from '@/utils/func'

const { Option } = Select

class DepartmentRoleSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      roleSimpleList: []
    }
  }

  componentDidMount () {
    this.fetchRoleList()
  }

  fetchRoleList () {
    departmentRoleList().then(list => {
      this.setState({ roleSimpleList: list })
    })
  }

  render () {
    const { placeholder, ...restProps } = this.props
    const { roleSimpleList } = this.state
    const options = roleSimpleList

    return (
      <Select
        placeholder="请选择角色"
        {...restProps}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
      >
        {options.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
      </Select>
    )
  }
}

DepartmentRoleSelectorAutoFetch.propTypes = {
  projectId: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
}

DepartmentRoleSelectorAutoFetch.defaultProps = {
  onChange: noop
}

export default DepartmentRoleSelectorAutoFetch
