import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { list } from '@/apis/base-layer-categories'
import { Select } from 'antd'

const { Option } = Select

class BaseLayerCateSelectorAutoFetch extends Component {
	constructor (props) {
    super(props)
    this.state = {
      baseLayerCateList: []
    }
  }
	
	componentDidMount () {
		this.fetchBaseLayerCateList()
	}
	
	fetchBaseLayerCateList () {
		list().then( list => this.setState({ baseLayerCateList : list.list }) )
	}
	
	render () {
		const { baseLayerCateList } = this.state
		return (
      <Select
			  {...this.props}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
			>
        {baseLayerCateList.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
      </Select>
    )
	}
}




BaseLayerCateSelectorAutoFetch.propTypes = {
	
}

BaseLayerCateSelectorAutoFetch.defaultProps ={
	
}

export default BaseLayerCateSelectorAutoFetch