import React, { Component } from 'react'
import {Tree, Button, Icon, Tag} from 'antd'
import _ from "lodash"
import ProtocolTreeItem from './ProtocolTreeItem'

const { TreeNode, DirectoryTree } = Tree

const getProtocolClasses = () => {
  const protocolLevels = window.CVT.PROTOCOL_TYPE
  return Object.keys(protocolLevels).map(key => ({
    key: protocolLevels[key].key,
    name: protocolLevels[key].value,
  }))
}

class ProtocolTree extends Component {
  constructor (props) {
    super(props)
    this.state = {
      treeObjects: props.treeData
    }
  }

  componentDidMount () {
    const { treeData } = this.props
    this.fetchTreeDatas(treeData)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.treeData !== this.props.treeData) {
      this.fetchTreeDatas(nextProps.treeData)
    }
  }

  fetchTreeDatas (treeData) {
    let { treeObjects } = this.state
    const groupDatas = _.groupBy(treeData, 'type')

    treeObjects = [...getProtocolClasses(),{key: '0', name: '未分类'}].map(obj => {
      let chilData = treeData.filter(
        item => item.type === obj.key
      ).map(item => ({
        ...item, type: 'protocol'})
      )
      return {...obj, children: chilData.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN', {sensitivity: 'accent'}))}
    })
    //协议未分类处理
    treeData.map(item => {
      if (!item.type) {
        const unclassifiedData = [ ...groupDatas['null'] ].map(item => {return {...item, type: 'protocol'}})
        treeObjects.filter(f => f.key === '0')[0].children = unclassifiedData.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN', {sensitivity: 'accent'}))
      }
    })
    this.setState({ treeObjects: treeObjects })
  }

  renderTreeNodeTitle (item) {
    const { onContextMenuClick, onUpdate } = this.props
    return (
      <ProtocolTreeItem
        data={item}
        onContextMenuClick={onContextMenuClick}
        onUpdate={onUpdate}
      />
    )
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      return (
        <TreeNode
          title={this.renderTreeNodeTitle(item)}
          key={item.key || item.id}
          isLeaf={item.type==='protocol'}
        >
          {item.children && this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    })
  }

  render () {
    const { treeObjects } = this.state
    return (
      <DirectoryTree >
        {this.renderTreeNodes(treeObjects)}
      </DirectoryTree>
    )
  }
}

ProtocolTree.propTypes = {

}

ProtocolTree.defaultProps = {

}

export default ProtocolTree
