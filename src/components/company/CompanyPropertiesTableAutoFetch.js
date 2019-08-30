import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PropertiesTable from '@/lib/components/PropertiesTable'
import * as companyAPI from '@/apis/companies'
import { COMPANY_LABELS } from '@/constants/labels'

class CompanyPropertiesTable extends Component {

  constructor (props) {
    super(props)
    this.state = {
      data: null,
      loading: true
    }
  }

  componentDidMount () {
    this.fetch()
  }

  fetch () {
    this.setState({ loading: true })
    companyAPI.get(this.props.id).then(r => {
      this.setState({
        data: r,
        loading: false
      })
    }).catch(err => {
      this.setState({ loading: false })
    })
  }

  render () {
    const { loading, data } = this.state
    return <PropertiesTable properties={data || {}} labelMapping={COMPANY_LABELS} loading={loading} />
  }
}

CompanyPropertiesTable.propTypes = {
  id: PropTypes.string.isRequired
}

export default CompanyPropertiesTable
