import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import * as districtAPI from '@/apis/districts'
import { noop } from '@/utils/func'

const { Option } = Select

class ProvinceSelectAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      provinceList: []
    }
  }

  componentDidMount () {
    this.fetchProvinceList()
  }

  fetchProvinceList () {
    districtAPI.provinces().then(r => this.setState({ provinceList: r || [] }))
  }

  render () {
    return (
      <Select
        {...this.props}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
      >
        {this.state.provinceList.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
      </Select>
    )
  }
}

ProvinceSelectAutoFetch.propTypes = {
}

ProvinceSelectAutoFetch.defaultProps = {
}

export default ProvinceSelectAutoFetch
