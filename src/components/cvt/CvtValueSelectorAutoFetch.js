import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CvtValueSelector from '@/components/cvt/CvtValueSelector'
import { cvtValueList } from '@/apis/cvts'
import _ from 'lodash'
import { noop } from '@/utils/func'

class CvtValueSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cvtValueList: []
    }
  }

  componentDidMount () {
    this.fetchCvtValueList(this.props.cvtType, this.props.cvtCode)
  }

  componentWillReceiveProps ({ cvtType, cvtCode, projectId }) {
    if (
      !_.isEqual([cvtType, cvtCode, projectId], [this.props.cvtType, this.props.cvtCode, this.props.projectId])
    ) {
      this.fetchCvtValueList(cvtType, cvtCode, projectId)
    }
  }

  fetchCvtValueList (type, code, projectId) {
    const { onReady } = this.props

    if (window.CVT[code]) {
      const list = Object.values(window.CVT[code])
      this.setState({ cvtValueList: list })
      onReady(list)
    } else {
      cvtValueList(code, projectId).then(list => {
        this.setState({ cvtValueList: list })
        onReady(list)
      })
    }
  }

  render () {
    const { cvtValueList } = this.state
    return (
      <CvtValueSelector cvtValueList={cvtValueList.sort((a, b) => a.sortNo - b.sortNo)} {...this.props} />
    )
  }
}

CvtValueSelectorAutoFetch.propTypes = {
  cvtType: PropTypes.string.isRequired,  // 'project' 'base'
  cvtCode: PropTypes.string.isRequired,
  projectId: PropTypes.string,  // when cvtType === 'project', projectId is required
  onReady: PropTypes.func,
  // other Select prop
}

CvtValueSelectorAutoFetch.defaultProps = {
  onReady: noop
}

export default CvtValueSelectorAutoFetch
