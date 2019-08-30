import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'
import { noop } from '@/utils/func'
import { buildTree, findNodeByKey } from '@/utils/tree'
import _ from 'lodash'

const { TreeNode } = TreeSelect
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const key = ',,'

class ManagerDepartmentTreeSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      departmentList: [],
      value: props.value
    }
  }

  componentDidMount () {
    this.fetchdepartmentList()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value })
    }
    if (nextProps.departments !== this.props.departments) {
      this.setState({
        departmentList: buildTree(nextProps.departments, { key: 'id', parentKey: 'parentId' })
      })
    }
  }
	
  fetchdepartmentList () {
		const { departments } = this.props
		this.setState({
			departmentList: buildTree(this.props.departments, { key: 'id', parentKey: 'parentId' })
		})
  }

  changeHandler = (value) => {
    this.setState({ value })
    value = value.map(v => {
      return v.indexOf(key) === 0 ? v.replace(key, '') : v
    })
    let newValue = value
    let selectedDepartment
    findNodeByKey(this.state.departmentList, newValue, item => selectedDepartment = item, { keyPropName: 'id', childrenPropName: 'children' })
    this.props.onChange(newValue)
  }
	
  renderTreeNodes (data) {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      } else {
        return (
          <TreeNode title={item.name} key={item.id} value={item.id} />
        )
      }
    })
  }

  render () {
    const { departmentList, value } = this.state
    const departGroup = Object.values(_.groupBy(departmentList, 'roleId')) 
    const treeData = departGroup.map((depts, index) => {
      const { role } = depts[0] || {}
      return {
        name: role && role.name,
        id: key+depts.map(d => d.id).join(','),
        children: depts
      }
    })

    return (
      <TreeSelect
        style={{ width: '100%' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择部门"
        allowClear
				multiple
        treeDefaultExpandAll
				showCheckedStrategy={SHOW_PARENT}
				treeCheckable={true}
        onChange={this.changeHandler}
      >
        {this.renderTreeNodes(treeData)}
      </TreeSelect>
    )
  }
}

ManagerDepartmentTreeSelectorAutoFetch.propTypes = {
  onChange: PropTypes.func
}

ManagerDepartmentTreeSelectorAutoFetch.defaultProps = {
  onChange: noop
}

export default ManagerDepartmentTreeSelectorAutoFetch
