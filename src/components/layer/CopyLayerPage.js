import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, message, Tree, Icon } from 'antd'
import DepartmentSelectorAutoFetch from '@/components/department/DepartmentSelectorAutoFetch'
import * as departmentAPI from '@/apis/departments'
import { noop } from '@/utils/func'

const TreeNode = Tree.TreeNode

class CopyLayerPage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layerTreeData: []
    }
  }

  componentDidMount () {
  }

  departmentChangeHandler = (deptId) => {
    const { projectId, onDepartmentChange } = this.props
    departmentAPI.getLayerTreeData(projectId, deptId).then(r => {
      this.setState({ layerTreeData: r })
      onDepartmentChange && onDepartmentChange(deptId, r)
    })
  }

  render () {
    const { projectId, departmentId, selectedDepartmentId } = this.props
    const { layerTreeData } = this.state

    const loop = layers => layers.map(layer => {
      if (layer.type === 'category') {
        return (
          <TreeNode key={layer.id} title={<span><Icon type='folder'/> {layer.name}</span>}>
            {loop(layer.children || [])}
          </TreeNode>
        )
      }
      return <TreeNode key={layer.id} title={<span><Icon type="file"/> {layer.name}</span>} isLeaf={true}/>
    })

    return (
      <div>
        <div style={{marginBottom:'20px'}}>
          <DepartmentSelectorAutoFetch style={{ width: '100%' }} projectId={projectId} onChange={this.departmentChangeHandler}/>
        </div>
        <h3>图层结构</h3>
        {
          layerTreeData.length > 0
          ? <Tree
              checkable={false}
              draggable={false}
            >
              {loop(layerTreeData)}
            </Tree>
          : <div style={{textAlign:'center',marginTop:'14px'}}>
              {selectedDepartmentId ? '当前部门无图层配置' : '未选择部门'}
            </div>
        }
      </div>
    )
  }
}

CopyLayerPage.propTypes = {
  projectId: PropTypes.string,
  departmentId: PropTypes.string,
  selectedDepartmentId: PropTypes.string,
  onDepartmentChange: PropTypes.func
}

CopyLayerPage.defaultProps = {
  onDepartmentChange: noop
}

export default CopyLayerPage
