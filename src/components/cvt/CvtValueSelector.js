import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { noop } from '@/utils/func'
import _ from 'lodash'

const { Option } = Select

class CvtValueSelector extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cvtValueList: props.cvtValueList || []
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(nextProps.cvtValueList, this.props.cvtValueList)) {
      this.setState({ cvtValueList: nextProps.cvtValueList })
    }
  }

  render () {
    const { cvtValueList } = this.state
    const { showAll, showAllText } = this.props
    let list = cvtValueList
    if (showAll) {
      list = [{ key: '-1', value: showAllText }, ...cvtValueList ]
    }

    return (
      <Select {...this.props}>
        {list.map(c => <Option key={c.key}>{c.value}</Option>)}
      </Select>
    )
  }
}

CvtValueSelector.propTypes = {
  showAll: PropTypes.bool,
  showAllText: PropTypes.string,
  value: PropTypes.string,
  cvtValueList: PropTypes.array.isRequired,
  onChange: PropTypes.func,
}

CvtValueSelector.defaultProps = {
  showAll: false,
  showAllText: "所有",
  cvtValueList: [],
  onChange: noop
}

export default CvtValueSelector
