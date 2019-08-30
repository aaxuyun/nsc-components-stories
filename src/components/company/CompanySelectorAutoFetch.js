import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { simpleList } from '@/apis/companies'
import { noop } from '@/utils/func'

const { Option } = Select

class CompanySelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      companySimpleList: []
    }
  }

  componentDidMount () {
    this.fetchCompanySimpleList()
  }

  fetchCompanySimpleList () {
    simpleList().then(list => this.setState({ companySimpleList: list }))
  }

  render () {
    return (
      <Select
        {...this.props}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
      >
        {this.state.companySimpleList.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
      </Select>
    )
  }
}

CompanySelectorAutoFetch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}

CompanySelectorAutoFetch.defaultProps = {
  onChange: noop
}

export default CompanySelectorAutoFetch
