import { Component } from "react";
import PropTypes from 'prop-types'
import * as districtAPI from '@/apis/districts'
import { TreeSelect, message } from 'antd'

const TreeNode = TreeSelect.TreeNode
const SHOW_PARENT = TreeSelect.SHOW_PARENT


class DistrictMultipleTreeSelectAutoFetch extends Component {

  state = {
    value: [],
    distTree: [],
  }

  componentDidMount () {
    this.fetchProvinces().then((res) => {
      if (res.length) {
        this.setState({
          distTree: res
        })
        this.fetchEchoData()
      }
    }).catch(() => {
      message.warning('地区加载失败')
    })
  }

  //数据回显
  fetchEchoData = async () => {
    /**
     * value
     * [ 
     *  { province: "110000", city: "110101", county: null }  
     *  { province: "110000", city: null, county: null } 
     * ]
     */
    const { distTree } = this.state
    const { value } = this.props

    if (!value || value.length === 0) {
      return
    }

    //拼接city
    const citysParentId = [...new Set(value.map(v => v.province).filter(v => v))] 
    const resultCitys = await Promise.all(citysParentId.map(v => this.fetchCities(v)))
    distTree.forEach(d => {
      resultCitys.flat(1).forEach(r => {
        if (r.parentId == d.id) {
          if (!d.children){
            d.children = []
          }
          d.children.push(r)
        }
      })
    })

    //拼接county
    const countysParentId = [...new Set(value.map(c => c.city).filter(c => c))]  
    const resultCountys = await Promise.all(countysParentId.map(v => this.fetchCounties(v)))
    distTree.forEach(item => {
      const city = item.children
      if (city) {
        city.forEach(c => {
          resultCountys.flat(1).forEach(r => {
            if (r.parentId == c.id) {
              if (!c.children) {
                c.children = []
              }
              c.children.push(r)
            }
          })
        })
      }
    })

    const newValue = [...new Set(value.map(v => (v.county || v.city || v.province)))]
    this.setState({ distTree }, ()=>{
      this.setState({ value: newValue })
    })
  }

  fetchProvinces () {
    return districtAPI.provinces()
  }

  fetchCities (parentId) {
    return districtAPI.cities(parentId)
  }

  async fetchCounties (parentId) {
    let result = await districtAPI.counties(parentId)
    result = result.map(item => ({...item, isLeaf: true}))
    return Promise.resolve(result)
  }

  loadData = async (node) => {
    const { distTree } = this.state
    const { dataRef } = node.props
    let resultData = null

    switch (dataRef.level) {
      case 0: 
        resultData = await this.fetchCities(dataRef.id)
        break;
      case 1:
        resultData = await this.fetchCounties(dataRef.id)
        break;
    }
    if (!dataRef.children) {
      dataRef.children = resultData
      distTree.forEach(item => {
        if (item.id === dataRef.id) {
          item = dataRef
        }
      })
    }
    this.setState({ distTree })
    return Promise.resolve(true)
  }

  renderTreeNodes = data => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id} dataRef={item} level={item.level} isLeaf={item.isLeaf}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name} key={item.id} dataRef={item} level={item.level} isLeaf={item.isLeaf}/>
    })
  }

  onChange = (value, label, { allCheckedNodes }) => {
    console.log('val', value)
    const { distTree } = this.state
    this.setState({ value })
    if (value.length === 0) {
      return this.props.getTreeData([])
    }
    /**
     * ["0-1-0-0", "0-1-0-1"]  
     * ==>  
     * [ 
     *  { province: "110000", city: "110101", county: null }  
     *  { province: "110000", city: null, county: null } 
     * ]
     */
    allCheckedNodes = allCheckedNodes.map(item => {
      const [ province, city, county ] = item.pos.substring(2, item.length).split('-')
      let provinceNode = province ? distTree[province] : null
      let cityNode = null
      let countyNode = null
      if (provinceNode) {
        cityNode = city ? provinceNode.children[city] : null
        if (cityNode) {
          countyNode = county ? cityNode.children[county] : null
        }
      }
      return { 
        province: provinceNode ? provinceNode.id : null,
        city: cityNode ? cityNode.id : null,
        county: countyNode ? countyNode.id : null,
      }
    })

    this.props.getTreeData(allCheckedNodes)
  }

  render () {
    return (
      <TreeSelect
        {...this.props}
        value={this.state.value}
        onChange={this.onChange}
        loadData={this.loadData}
      >
        {this.renderTreeNodes(this.state.distTree)}
      </TreeSelect>
    )
  }
}

DistrictMultipleTreeSelectAutoFetch.propTypes = {
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  allowClear: PropTypes.bool,
  showSearch: PropTypes.bool,
  dropdownStyle: PropTypes.object,
  getTreeData: PropTypes.func,
}

DistrictMultipleTreeSelectAutoFetch.defaultProps = {
  placeholder: '请选择地区',
  multiple: true,
  allowClear: true,
  dropdownStyle: { maxHeight: 400, overflow: 'auto' },
  showSearch: false,
  labelInValue: false,
  treeCheckable: true,
  treeCheckStrictly: false,
  showCheckedStrategy: SHOW_PARENT,
  getTreeData: () => {}
}

export default DistrictMultipleTreeSelectAutoFetch