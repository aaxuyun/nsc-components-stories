import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Cascader } from 'antd'
import { noop } from '@/utils/func'
import * as districtAPI from '@/apis/districts'
import { findNodeByKey } from '@/utils/tree'

const mapper = districtItem => ({
  value: `${districtItem.id}`,
  label: districtItem.name,
  level: districtItem.level,
  isLeaf: districtItem.level === 2
})
const FIND_NODE_BY_KEY_OPTS = { keyPropName: 'value', childrenPropName: 'children' }

class DistrictCascader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      options: [],
      value: props.value || []
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(nextProps.value, this.props.value)) {
      this.setState({ value: nextProps.value || [] })

      if (nextProps.value && nextProps.value.length > 0) {
        this.loadDataForValue(nextProps.value)
      }
    }
  }

  componentDidMount () {
    const { value } = this.state

    // load provinces first
    this.fetchProvinces().then(r => {
      this.setState({
        options: r.map(mapper)
      })

      // if we have value, load value related districts
      if (value.length > 0) {
        this.loadDataForValue(value)
      }
    })
  }

  fetchProvinces () {
    return districtAPI.provinces()
  }

  fetchCities (parentId) {
    return districtAPI.cities(parentId)
  }

  fetchCounties (parentId) {
    return districtAPI.counties(parentId)
  }

  fetchParents (id) {
    return districtAPI.parents(id)
  }

  loadDataForValue (value) {
    const [ province, city, county ] = value
    const { options } = this.state
    const tasks = [
      this.fetchCities(province),
      this.fetchCounties(city)
    ]

    Promise.all(tasks).then(r => {
      const [ cities, counties ] = r

      value.forEach(key => findNodeByKey(options, key, opt => {
        if (opt.level === 0) {
          opt.children = cities.map(mapper)
        } else if (opt.level === 1) {
          opt.children = counties.map(mapper)
        }
      }, FIND_NODE_BY_KEY_OPTS))

      this.setState({ options: [ ...options ] })
    })
  }

  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true

    let p

    if (targetOption.level === 0) { // province
      p = this.fetchCities(targetOption.value)
    } else if (targetOption.level === 1) { // city
      p = this.fetchCounties(targetOption.value)
    }

    p.then(r => {
      targetOption.loading = false
      targetOption.children = r.map(mapper)

      this.setState({
        options: [...this.state.options]
      })
    })
  }

  changeHandler = (value, selectedOptions) => {
    this.props.onChange(value)
  }

  render () {
    const { value, onChange, ...rest } = this.props
    return (
      <Cascader
        {...rest}
        value={this.state.value}
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.changeHandler}
      />
    )
  }
}

DistrictCascader.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func
  // other cascaader options
}

DistrictCascader.defaultProps = {
  onChange: noop
}

export default DistrictCascader
