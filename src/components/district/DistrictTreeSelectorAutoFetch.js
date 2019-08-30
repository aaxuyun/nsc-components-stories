import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'
import { noop } from '@/utils/func'
import * as districtAPI from '@/apis/districts'

const { TreeNode, SHOW_PARENT } = TreeSelect
const DISTRICT_LEVEL = {
  PROVINCE: 0,
  CITY: 1,
  COUNTY: 2
}

const districtsToTreeData = (districts, level = DISTRICT_LEVEL.COUNTY) => districts.map(district => ({
  value: `${district.id}`,
  key: `${district.id}`,
  title: district.name,
  level: district.level, // 0: province, 1: city, 2: county
  isLeaf: district.level === level,
  children: null
}))

class DistrictTreeSelectorAutoFetch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value || [],
      treeData: []  // [{ key, value, title, isLeaf, level, children }]
    }
  }

  componentDidMount () {
    this.fetchProvinces().then(r => this.setState({ treeData: districtsToTreeData(r) }))
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value })
    }
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

  changeHandler = (value, label, extra) => {
    // 因为是异步加载，所以有可能在勾选父节点时，其子节点还未加载
    // 这里就在勾选时，确保其下一级子节点加载
    /* this.loadDataHandler(extra.triggerNode).then(() => {
      const { onChange } = this.props
      this.setState({ value })
      onChange(value)
    }) */

    const { onChange } = this.props
    this.setState({ value })
    onChange(value)
  }

  loadDataHandler = (treeNode) => {
    const nodeData = treeNode.props.dataRef
    const { level } = this.props

    return new Promise(resolve => {
      if (nodeData.isLeaf || treeNode.props.children) {
        resolve()
      } else {
        let p
        if (nodeData.level === DISTRICT_LEVEL.PROVINCE) { // load cities for province node
          p = this.fetchCities(nodeData.key)
        } else if (nodeData.level === DISTRICT_LEVEL.CITY) { // load counties for city node
          p = this.fetchCounties(nodeData.key)
        }

        p.then(districts => {
          nodeData.children = districtsToTreeData(districts, level)
          this.setState({
            treeData: [...this.state.treeData]
          })

          resolve()
        })
      }
    })
  }

  renderTreeNode = (data) => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode {...item} dataRef={item}>
            {this.renderTreeNode(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} dataRef={item} />
    })
  }

  render () {
    const { level, style } = this.props
    const { value, treeData } = this.state
    const tProps = {
      value,
      loadData: level === DISTRICT_LEVEL.PROVINCE ? undefined : this.loadDataHandler,
      onChange: this.changeHandler,
      treeCheckable: true,
      // showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择行政区划',
      style: style || { width: '100%' }
    }

    return (
      <TreeSelect {...tProps}>
        {this.renderTreeNode(treeData)}
      </TreeSelect>
    )
  }
}

DistrictTreeSelectorAutoFetch.propTypes = {
  value: PropTypes.array,
  province: PropTypes.string, // fix province as target value
  city: PropTypes.string, // fix city as target value
  level: PropTypes.number,  // DISPLAY_LEVEL
  onChange: PropTypes.func
}

DistrictTreeSelectorAutoFetch.defaultProps = {
  onChange: noop,
  level: DISTRICT_LEVEL.COUNTY // by default, it will display province -> city -> county
}

DistrictTreeSelectorAutoFetch.LEVEL = DISTRICT_LEVEL

export default DistrictTreeSelectorAutoFetch
