import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tree, Icon } from 'antd'
import CreateDepartmentModal from '@/containers/modals/project/department/CreateDepartment'
import EditDepartmentModal from '@/containers/modals/project/department/EditDepartment'
import * as departmentAPI from '@/apis/departments'
import { noop } from '@/utils/func'
import { buildTree, findNodeByKey } from '@/utils/tree'
import styles from './DepartmentTreeAutoFetch.css'

const { TreeNode } = Tree

/**
 * 部门树
 * 1. 展示树状结构
 * 2. 可选择：onSelectAll, onSelectDepartment
 * 3. 可添加：onDepartmentCreated
 * 4. 可编辑：onDepartmentEdited
 */
class DepartmentTree extends Component {
  constructor (props) {
    super(props)
    this.state = {
      departmentSimpleList: [],
      selectedKeys: []
    }
  }

  componentDidMount () {
    this.fetchDepartmentSimpleList()
  }

  fetchDepartmentSimpleList () {
    departmentAPI.simpleList(this.props.projectId,this.props.type).then(list => {
      this.setState({
        departmentSimpleList: buildTree(list, { key: 'id', parentKey: 'parentId' })
      })
    })
  }

  selectHandler = (selectedKeys, event) => {
    const { onSelectAll, onSelectDepartment } = this.props

    // cannot use selectedKeys, coz it has toggle behavior if you click a node twice, which will make selectedKeys empty
    // event.node is the node that you clicked
    const key = event.node.props.eventKey
    let selectedDepartment

    findNodeByKey(this.state.departmentSimpleList, key, (dept) => {
      selectedDepartment = dept
    }, { keyPropName: 'id', childrenPropName: 'children' })

    this.setState({
      selectedKeys: [event.node.props.eventKey]
    })

    if (key === 'all') {
      onSelectAll && onSelectAll()
    } else {
      onSelectDepartment(key, selectedDepartment)
    }
  }

  departmentCreatedHandler = () => {
    const { onDepartmentCreated } = this.props
    this.fetchDepartmentSimpleList()
    onDepartmentCreated()
  }

  departmentEditedHandler = () => {
    const { onDepartmentEdited } = this.props
    this.fetchDepartmentSimpleList()
    onDepartmentEdited()
  }

  renderTreeNodeTitle (dept, allowEdit) {
    const { enableCreate, enableEdit, projectId } = this.props
    const ableToHaveChildrenDepartment = dept.type 

    return (
      <span className={styles.titleWrapper}>
        <span>{dept.name}</span>
        {
          enableCreate && ableToHaveChildrenDepartment
          ? <span className={styles.createBtnWrapper} onClick={e => e.stopPropagation()}>
              <CreateDepartmentModal
                projectId={projectId}
                departmentData={{ type: `${Number(dept.type) + 1}`, parentId: dept.id }} // new department should have level value as: parent.type + 1
                onCreated={this.departmentCreatedHandler}
              >
                <Icon type="plus-circle" />
              </CreateDepartmentModal>
            </span>
          : null
        }
        {
          enableEdit && allowEdit
          ? <span className={styles.editBtnWrapper} onClick={e => e.stopPropagation()}>
              <EditDepartmentModal
                projectId={projectId}
                departmentData={dept}
                onEdited={this.departmentEditedHandler}>
                <Icon type="edit" />
              </EditDepartmentModal>
            </span>
          : null
        }
      </span>
    )
  }

  renderTreeNodes (data) {
    return data.map(item => {
      // if (!item.children) { item.children = [] } // this force every node has the expand + icon
      if (item.children) {
        return (
          <TreeNode title={this.renderTreeNodeTitle(item, true)} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      } else {
        return (
          <TreeNode title={this.renderTreeNodeTitle(item, true)} key={item.id}>
          </TreeNode>
        )
      }
    })
  }

  /* public methods */
  refresh () {
    this.fetchDepartmentSimpleList()
  }

  render () {
    const { selectedKeys, departmentSimpleList } = this.state
    return (
      <Tree
        showLine
        selectedKeys={selectedKeys}
        defaultExpandedKeys={['all']}
        onSelect={this.selectHandler}
      >
        {
          this.props.onSelectAll
          ? <TreeNode title={this.renderTreeNodeTitle({ name: '全部', type: '0', parentId: null }, false)} key="all">
              {this.renderTreeNodes(departmentSimpleList)}
            </TreeNode>
          : this.renderTreeNodes(departmentSimpleList)
        }
      </Tree>
    )
  }
}

DepartmentTree.propTypes = {
  projectId: PropTypes.string.isRequired,
  enableCreate: PropTypes.bool, // 是否允许创建部门
  enableEdit: PropTypes.bool, // 是否允许编辑部门
  onSelectAll: PropTypes.func,
  onSelectDepartment: PropTypes.func,
  onDepartmentCreated: PropTypes.func,
  onDepartmentEdited: PropTypes.func
}

DepartmentTree.defaultProps = {
  enableCreate: true,
  enableEdit: true,
  onSelectAll: null,
  onSelectDepartment: noop,
  onDepartmentCreated: noop,
  onDepartmentEdited: noop
}

export default DepartmentTree
