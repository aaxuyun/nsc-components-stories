import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PropertiesTable from '@/lib/components/PropertiesTable'
import * as projectAPI from '@/apis/projects'
import { PROJECT_LABELS } from '@/constants/labels'

class ProjectPropertiesTable extends Component {

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
    projectAPI.get(this.props.id).then(r => {
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
    return <PropertiesTable properties={data || {}} labelMapping={PROJECT_LABELS} loading={loading} />
  }
}

ProjectPropertiesTable.propTypes = {
  id: PropTypes.string.isRequired
}

export default ProjectPropertiesTable
