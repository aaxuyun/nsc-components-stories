import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { list } from '@/apis/base-map-service-auths'
import { Select } from 'antd'

const { Option } = Select

class BaseMapServiceAuthsSelectorAutoFetch extends Component {
	state = {
    authList: []
  }
	
	componentDidMount () {
		this.fetchAuthList(this.props.mapServerUrl)
  }
  
  componentWillReceiveProps (nextProps) {
    if (nextProps.mapServerUrl !== this.props.mapServerUrl) {
      this.fetchAuthList(nextProps.mapServerUrl)
    }
  }
	
	fetchAuthList () {
    list({
      fields: 'id,host,username'
    }, { page: 0 }).then(({ list = [] }) => {
      this.setState({ authList: list })
    })
  }
  
  renderOption (item) {
    return (
      <Option key={item.id} value={item.id}>
        {`${item.username}@${item.host}`}
      </Option>
    )
  }
	
	render () {
		const { authList } = this.state
		return (
      <Select
			  {...this.props}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
			>
        {authList.map(a => this.renderOption(a))}
      </Select>
    )
	}
}

BaseMapServiceAuthsSelectorAutoFetch.propTypes = {
  mapServerUrl: PropTypes.string // 参考 host，作为查询条件使用
}
BaseMapServiceAuthsSelectorAutoFetch.defaultProps = {
  mapServerUrl: undefined
}

export default BaseMapServiceAuthsSelectorAutoFetch