import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { list } from '@/apis/departments'
import { noop } from '@/utils/func'
import _ from 'lodash'

const { Option, OptGroup } = Select

class DepartmentSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      departmentList: []
    }
  }

  componentDidMount () {
    this.fetchDepartmentSimpleList()
  }

  fetchDepartmentSimpleList () {
    const { projectId, role, onReady } = this.props
    list({ projectId, role, include: 'role' }, { page: 0 }).then(list => {
      this.setState({ departmentList: list })
      onReady(list)
    })
  }

  render () {
    const { allOption, placeholder, grouped, role, filter, ...restProps } = this.props
    let { departmentList } = this.state
    const options = allOption
      ? [allOption === true ? { id: '-1', name: '全部部门' } : allOption, ...departmentList]
      : departmentList
    const selectProps = {
      placeholder: "请选择部门",
      ...restProps,
      showSearch: true,
      optionFilterProp: "children",
      filterOption: (input, option) => option.props.children.indexOf(input) >= 0
    }

    departmentList = departmentList.filter(filter)

    if (grouped && !role) {
      const roles = _.uniqBy(departmentList.map(d => d.role), r => r.id)
      return (
        <Select {...selectProps}>
          {allOption ?
            <Option key={options[0].id} value={options[0].id}>{options[0].name}</Option>
          : null}
          {roles.map(role => 
            <OptGroup key={role.id} label={role.name}>
            {options.filter(d => d.role && d.role.id === role.id).map(d => 
              <Option key={d.id} value={d.id}>{d.name}</Option>
            )}
            </OptGroup>
          )}
        </Select>
      )
    } else {
      return (
        <Select {...selectProps}>
          {options.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
        </Select>
      )
    }
  }
}

DepartmentSelectorAutoFetch.propTypes = {
  projectId: PropTypes.string,
  role: PropTypes.string,
  grouped: PropTypes.bool,
  value: PropTypes.string,
  allOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onChange: PropTypes.func,
  onReady: PropTypes.func,
  filter: PropTypes.func,
}

DepartmentSelectorAutoFetch.defaultProps = {
  role: undefined,
  allOption: true,
  grouped: false,
  onChange: noop,
  onReady: () => {},
  filter: dept => true
}

export default DepartmentSelectorAutoFetch
