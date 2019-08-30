import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, message, Button, Radio } from 'antd'
import ProtocolClassificationTree from '@/components/protocol/Classification/ProtocolClassificationTree'
import UnclassifiedProtocolList from '@/components/protocol/Classification/UnclassifiedProtocolList'
import * as protocolAPI from '@/apis/protocols'
import { noop } from '@/utils/func'

const getProtocolClasses = (type) => {
  const protocolLevels = type === 'level' ? window.CVT.PROTOCOL_LEVEL : window.CVT.PROTOCOL_TYPE
  return Object.keys(protocolLevels).map(key => ({
    key: protocolLevels[key].key,
    name: protocolLevels[key].value,
  }))
}

class ProtocolClassificationPage extends Component {
  constructor (props) {
    super(props)
    const expandedKeys = getProtocolClasses().map(item => item.key)
    this.state = {
      selectedListObjectIds: [],
      selectedTreeNode: null,
      listObjects: [],
      treeObjects: [],
      selectedTreeKeys: [],
      expandedTreeKeys: expandedKeys,
      selectedRadioKey: 'type',
      protocolClasses: getProtocolClasses()
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData (queryData) {
    const { projectId, sectionId } = this.props
    const { selectedRadioKey } = this.state
    const query = queryData || { projectId, sectionId }
    if (selectedRadioKey === 'type') {
      query.type = 'null'
    } else if (selectedRadioKey === 'level') {
      query.level = 'null'
    }
    protocolAPI.list(query, { page: -1 }).then(list => {
      this.setState({ listObjects: list })
    })
  }

  addHandler = () => {
    const { selectedListObjectIds, selectedTreeNode, listObjects, treeObjects, selectedRadioKey } = this.state

    if(selectedListObjectIds.length === 0) {
      message.info('请在列表中选择协议')
      return
    }

    if(!selectedTreeNode || selectedTreeNode.props.dataRef.type === 'protocol') {
      message.info('请选择协议类型')
      return
    }

    const filteredList = listObjects.filter(obj => !selectedListObjectIds.includes(obj.id))
    const selectedList = listObjects.filter(obj => selectedListObjectIds.includes(obj.id))
    const selectedObjects = selectedList.map(obj => ({
      ...obj,
      level: selectedTreeNode.props.dataRef.key,
      selectedRadioKey
    }))
    this.setState({
      listObjects: filteredList,
      treeObjects: [...treeObjects, ...selectedObjects]
    })

    const { handleProtocolChange } = this.props
    handleProtocolChange && handleProtocolChange([...treeObjects, ...selectedObjects])
  }

  removeHandler = () => {
    const { selectedTreeNode, listObjects, treeObjects } = this.state

    if (!selectedTreeNode || selectedTreeNode.props.dataRef.type !== 'protocol') {
      message.info('请在树中选中协议')
      return
    }

    const objId = selectedTreeNode.props.dataRef.id
    const filteredList = treeObjects.filter(obj => objId !== obj.id)
    const selectedList = treeObjects.filter(obj => objId === obj.id)
    const selectedObjects = selectedList.map(obj => ({
      ...obj,
      level: null
    }))
    this.setState({
      listObjects: [...listObjects, ...selectedObjects],
      treeObjects: filteredList
    })

    const { handleProtocolChange } = this.props
    handleProtocolChange && handleProtocolChange(filteredList)
  }

  expandHandler = keys => {
    this.setState({ expandedTreeKeys: keys })
  }

  selectHandler = (keys, {selected, selectedNodes, node, event}) => {
    const key = node.props.eventKey
    this.setState({ selectedTreeKeys: [key], selectedTreeNode: node })
  }

  handleListObjectSelected = (selectedKeys, selectedRows) => {
    this.setState({ selectedListObjectIds: selectedKeys })
  }

  radioChangeHandler = (e) => {
    const radioKey = e.target.value
    this.setState({
      selectedListObjectIds: [],
      selectedTreeNode: null,
      listObjects: [],
      treeObjects: [],
      selectedTreeKeys: [],
      expandedTreeKeys: getProtocolClasses(radioKey).map(item => item.key),
      selectedRadioKey: radioKey,
      protocolClasses: getProtocolClasses(radioKey)
    }, () => this.fetchData())
  }

  render () {
    const { listObjects, treeObjects, selectedTreeKeys, expandedTreeKeys, selectedRadioKey, protocolClasses } = this.state

    return (
      <Row gutter={32} style={{height: '100%'}}>
        <Col span={8} style={{height: '100%'}}>
          <div style={{paddingBottom:15}}>
            <Radio.Group value={selectedRadioKey} onChange={this.radioChangeHandler} buttonStyle="solid">
              <Radio.Button value="type">类型归类</Radio.Button>
              <Radio.Button value="level">级别归类</Radio.Button>
            </Radio.Group>
          </div>
          <div style={{padding: 15, height: '100%', overflow: 'auto', backgroundColor: '#f0f2f5'}}>
            <UnclassifiedProtocolList
              listData={listObjects}
              onSelectChange={this.handleListObjectSelected}
            />
          </div>
        </Col>
        <Col span={2} style={{height: '100%'}}>
          <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
            <Button icon='right' onClick={this.addHandler}/>
            <Button icon='left' onClick={this.removeHandler}/>
          </div>
        </Col>
        <Col span={14} style={{height: '100%'}}>
				  <div style={{padding: 15, height: '100%', overflow: 'auto', backgroundColor: '#f0f2f5'}}>
            <ProtocolClassificationTree
              folders={protocolClasses}
              protocols={treeObjects}
              selectedKeys={selectedTreeKeys}
              expandedKeys={expandedTreeKeys}
              onExpand={this.expandHandler}
              onSelect={this.selectHandler}
            />
          </div>
        </Col>
      </Row>
    )
  }
}

ProtocolClassificationPage.propTypes = {
  handleProtocolChange: PropTypes.func,
}

ProtocolClassificationPage.defaultProps = {
  handleProtocolChange: noop
}

export default ProtocolClassificationPage
