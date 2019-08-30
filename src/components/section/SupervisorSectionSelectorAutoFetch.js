import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { getSupervisorSectionList } from '@/apis/sections'

const { Option, OptGroup } = Select

const sorter = (a, b) => a.sortNo - b.sortNo
const optionValue = section => `${section.lineId},${section.id}`

class SupervisorSectionSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sections: []
    }
  }

  componentDidMount () {
    const { projectId } = this.props
    if (projectId) {
      this.fetchSectionList(projectId)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId != this.props.projectId) {
      this.fetchSectionList(nextProps.projectId)
    }
  }

  fetchSectionList (projectId) {
    getSupervisorSectionList(projectId)
    .then(list => {
      console.log(list)
      this.setState({ sections: list })
    })
  }

  render () {
    const { lines, showAll, ...props } = this.props
    const { sections } = this.state

    return (
      <Select
        showSearch
        style={{ width: '100%', minWidth: '240px' }}
        placeholder="请选择标段"
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        {...props}
      >
      {showAll ? <Option value="-1" key="-1">全部标段</Option> : null}
        {lines.sort(sorter).map(line => {
          return (
            <OptGroup key={line.id} label={line.name}>
              {sections.filter(s => s.lineId === line.id).sort(sorter).map(section => {
                return (
                  <Option value={optionValue(section)} key={section.id}>{section.name}</Option>
                )
              })}
            </OptGroup>
          )
        })}
      </Select>
    )
  }
}

SupervisorSectionSelectorAutoFetch.propTypes = {
  projectId: PropTypes.string.isRequired,
}

SupervisorSectionSelectorAutoFetch.defaultProps = {
}

export default SupervisorSectionSelectorAutoFetch
