import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { noop } from '@/utils/func'
import * as districtAPI from '@/apis/districts'

const { Option } = Select
const DISPLAY_LEVEL = {
  PROVINCE: 0,
  CITY: 1,
  COUNTY: 2
}

class DistrictSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value || '',
      districts: []
    }
  }

  componentDidMount () {
    const { level, parentId } = this.props
    this.fetch(level, parentId)
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value })
    }

    if (nextProps.level !== this.props.level || nextProps.parentId !== this.props.parentId) {
      this.fetch(nextProps.level, nextProps.parentId)
    }
  }

  fetch (level, parentId) {
    let p
    this.setState({ districts: [] })

    // skip city and county fetch without parentId
    if (level !== DISPLAY_LEVEL.PROVINCE && !parentId) {
      return
    }

    if (level === DISPLAY_LEVEL.PROVINCE) {
      p = this.fetchProvinces()
    } else if (level === DISPLAY_LEVEL.CITY) {
      p = this.fetchCities(parentId)
    } else if (level === DISPLAY_LEVEL.COUNTY) {
      p = this.fetchCounties(parentId)
    }

    p.then(r => this.setState({ districts: r }))
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

  changeHandler = (value) => {
    const { onChange } = this.props
    this.setState({ value })
    onChange(value)
  }

  render () {
    const { districts, value } = this.state
    const { placeholder, mode, whiteList, ...restProps } = this.props
    const v = districts.length === 0
      ? []
      : ['multiple', 'tags', 'combobox'].includes(mode) ? (value || []) : (value ? `${value}` : undefined)
    const whiteListKeyMapping = {
      0: 'provinces',
      1: 'cities',
      2: 'counties'
    }

    return (
      <Select
        mode={mode || undefined}
        value={v}
        placeholder={placeholder || '请选择行政区划'}
        style={{ width: '100%' }}
        onChange={this.changeHandler}
        showSearch
        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
				{...restProps}
      >
        {
          districts.filter(dist => {
            const list = whiteList[whiteListKeyMapping[dist.level]] || []
            return list.length > 0 ? list.includes(`${dist.id}`) : true
          }).map(dist => <Option key={`${dist.id}`} value={`${dist.id}`}>{dist.name}</Option>)
        }
      </Select>
    )
  }
}

DistrictSelectorAutoFetch.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  parentId: PropTypes.string,
  level: PropTypes.number,  // DISPLAY_LEVEL
  whiteList: PropTypes.object,  // { provinces: [], cities: [], counties: [] }
  onChange: PropTypes.func
}

DistrictSelectorAutoFetch.defaultProps = {
  onChange: noop,
  whiteList: {},
  level: DISPLAY_LEVEL.COUNTY // by default, it will display province -> city -> county
}

DistrictSelectorAutoFetch.LEVEL = DISPLAY_LEVEL

export default DistrictSelectorAutoFetch
