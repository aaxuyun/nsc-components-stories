import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PropertiesTable from '@/lib/components/PropertiesTable'
import * as usertAPI from '@/apis/users'
import * as companyAPI from '@/apis/companies'
import { USER_PROJECT_LABELS } from '@/constants/labels'
import _ from 'lodash'

class UserProjectTable extends Component {

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

	fetch() {
		this.setState({ loading: true })
    let dataArray = []
		usertAPI.getUserProjects(this.props.id)
    .then(r => {
			if (!r)
        throw new Error('noProj')

			r.map((proj, index)=> {
        dataArray[index] = {
          id: proj.id,
          project_name: proj.name
        }
				usertAPI.getUserDepartment(this.props.id, proj.id)
        .then(dep => {
					if (!dep)
            throw new Error('noDep')
          dataArray[index].dept_name = dep.name
          return dep.companyId
				})
        .then(companyId => companyAPI.get(companyId))
        .then(cmp => {
          if(!cmp)
            throw new Error('noCmp')
          dataArray[index].unit_name = cmp.name
        })
        .catch(() => {})
        .finally(() => {
          this.setState({
            data: dataArray,
            loading: false
          })
        })
			})
		})
    .catch(err => {
      this.setState({ loading: false })
    })
	}

  render () {
    const { loading, data } = this.state
		if(!_.isEmpty(data)){
			return data.map( item => {
				return (<PropertiesTable key={item.id} style={{ marginBottom: 10 }} properties={item || {}} labelMapping={USER_PROJECT_LABELS} loading={loading} />)
			})
		}else{
			return <PropertiesTable properties={{}} labelMapping={USER_PROJECT_LABELS}  />
		}
  }
}

UserProjectTable.propTypes = {
  id: PropTypes.string.isRequired
}

export default UserProjectTable
