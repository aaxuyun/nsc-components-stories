import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { simpleList } from '@/apis/projects'
import { noop } from '@/utils/func'

const { Option } = Select

class ProjectSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      projectSimpleList: []
    }
  }

  componentDidMount () {
    this.fetchList()
  }

  fetchList () {
    simpleList().then(list => this.setState({ projectSimpleList: list }))
  }

  render () {
    return (
      <Select
        {...this.props}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
      >
        {this.state.projectSimpleList.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
      </Select>
    )
  }
}

ProjectSelectorAutoFetch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}

ProjectSelectorAutoFetch.defaultProps = {
  onChange: noop
}

export default ProjectSelectorAutoFetch
