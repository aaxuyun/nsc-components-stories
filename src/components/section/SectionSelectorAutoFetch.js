import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { simpleList } from '@/apis/sections'
import { noop } from '@/utils/func'

const { Option } = Select

class SectionSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sectionSimpleList: []
    }
  }

  componentDidMount () {
    const { projectId, lineId } = this.props
    if (projectId && lineId) {
      this.fetchSectionSimpleList(projectId, lineId)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lineId != this.props.lineId) {
      const { projectId } = this.props
      this.fetchSectionSimpleList(projectId, nextProps.lineId)
    }
  }

  fetchSectionSimpleList (projectId, lineId) {
    const { defaultAsAll, defaultAsAllText, onReady } = this.props
    if (lineId === '-1') {
      lineId = ''
    }
    simpleList(projectId, lineId)
    .then(list => {
      if (defaultAsAll) {
        list.unshift({ id: '-1', name: defaultAsAllText || '所有标段' })
      }
      this.setState({ sectionSimpleList: list }, () => onReady && onReady(this.state.sectionSimpleList))
    })
  }

  render () {
    return (
      <Select
        {...this.props}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
      >
        {this.state.sectionSimpleList.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
      </Select>
    )
  }
}

SectionSelectorAutoFetch.propTypes = {
  projectId: PropTypes.string.isRequired,
  lineId: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onReady: PropTypes.func,
  defaultAsAll: PropTypes.bool,
  defaultAsAllText: PropTypes.string,
}

SectionSelectorAutoFetch.defaultProps = {
  lineId: '',
  onReady: noop,
  onChange: noop
}

export default SectionSelectorAutoFetch
