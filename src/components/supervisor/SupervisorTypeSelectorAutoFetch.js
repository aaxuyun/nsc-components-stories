import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { noop } from '@/utils/func'

const { Option, OptGroup } = Select

const folderCvtMapping = item => ({
  key: `${item.code}-${item.key}`,
  name: item.value,
  children: []
})

class SupervisorTypeSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listData: []
    }
  }

  componentDidMount () {
    if (!window.CVT.SUPERVISOR_ENTRUSTMENT || !window.CVT.SUPERVISOR_SUPERVISION) {
      console.log('window.CVT.SUPERVISOR not configed')
      return
    }

    const listData = [
      { key: 'SUPERVISOR_SUPERVISION', name: '专项督导', type: "SUPERVISOR_SUPERVISION", subType: "", children:
        Object.values(window.CVT.SUPERVISOR_SUPERVISION).map(folderCvtMapping)
      },
      { key: 'SUPERVISOR_ENTRUSTMENT', name: '专项委托', type: "SUPERVISOR_ENTRUSTMENT", subType: "", children:
        Object.values(window.CVT.SUPERVISOR_ENTRUSTMENT).map(folderCvtMapping)
      },
    ]

    this.setState({ listData })
  }

  renderGroups = (data) => {
    return data.map(item => {
      return (
        <OptGroup key={item.key} label={item.name}>
          {item.children && this.renderTypes(item.children)}
        </OptGroup>
      )
    })
  }

  renderTypes = (data) => {
    const { selectedKey } = this.state
    return data.map(item => {
      return <Option key={item.key} value={item.key}>{item.name}</Option>
    })
  }

  render () {
    const { listData } = this.state
    const { showAll } = this.props
    return (
      <Select
        {...this.props}
        showSearch
        optionFilterProp="children"
        placeholder='请选择类型'
        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
      >
        { showAll && <Option key='-1' value='-1'>全部类型</Option>}
        {this.renderGroups(listData)}
      </Select>
    )
  }
}

SupervisorTypeSelectorAutoFetch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}

SupervisorTypeSelectorAutoFetch.defaultProps = {
  onChange: noop
}

export default SupervisorTypeSelectorAutoFetch
