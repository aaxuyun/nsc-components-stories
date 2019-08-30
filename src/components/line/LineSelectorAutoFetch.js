import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { simpleList } from '@/apis/lines'
import { noop } from '@/utils/func'

const { Option } = Select

class LineSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lineSimpleList: []
    }
  }

  componentDidMount () {
    this.fetchLineSimpleList()
  }

  fetchLineSimpleList () {
    const { projectId, showAll } = this.props
    simpleList(projectId).then(list => {
      if (showAll) {
        list = [{ id: '-1', name: '全部线路' }, ...list]
      }
			this.setState({ lineSimpleList: list })
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
        {this.state.lineSimpleList.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
      </Select>
    )
  }
}

LineSelectorAutoFetch.propTypes = {
  // projectId: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func
}

LineSelectorAutoFetch.defaultProps = {
  onChange: noop
}

export default LineSelectorAutoFetch
