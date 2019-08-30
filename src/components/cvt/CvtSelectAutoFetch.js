import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { projectCvtList, baseCvtList } from '@/apis/cvts'
import { noop } from '@/utils/func'

const { Option } = Select

class CvtSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cvtList: []
    }
  }

  componentDidMount () {
    this.fetchCvtList()
  }

  fetchCvtList () {
    const { type, onReady } = this.props

    if (window.CVT) {
      let list

      if (type === 'base') {
        list = Object.values(window.CVT.BASE_CVT)
      } else if (type === 'project') {
        list = Object.values(window.CVT.PROJ_CVT)
      }

      this.setState({ cvtList: list })
      onReady(list)
    } else {
      let promise

      if (type === 'base') {
        promise = baseCvtList()
      } else if (type === 'project') {
        promise = projectCvtList()
      }

      promise.then(list => {
        this.setState({ cvtList: list })
        onReady(list)
      })
    }
  }

  render () {
    return (
      <Select {...this.props}>
        {this.state.cvtList.map(c => <Option key={c.key}>{c.value}</Option>)}
      </Select>
    )
  }
}

CvtSelectorAutoFetch.propTypes = {
  type: PropTypes.string.isRequired,  // 'project' 'base'
  value: PropTypes.string,
  onChange: PropTypes.func,
  onReady: PropTypes.func
}

CvtSelectorAutoFetch.defaultProps = {
  onChange: noop,
  onReady: noop
}

export default CvtSelectorAutoFetch
