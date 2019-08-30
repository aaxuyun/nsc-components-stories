import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table from '@/components/Table'
import { message } from 'antd'
import TooltipButton from '@/lib/components/TooltipButton'
import EditSectionModal from '@/containers/modals/project/section/EditSection'
import confirm from '@/components/confirm'
import * as lineAPI from '@/apis/lines'
import * as sectionAPI from '@/apis/sections'
import { noop } from '@/utils/func'

class SectionList extends Component{
  constructor(props) {
    super(props)
    this.state = {
      lineList: []
    }
  }
  componentDidMount() {
    const { projectId } = this.props
    lineAPI.simpleList(projectId).then(list => this.setState({ lineList: list }))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId !== this.props.projectId) {
      lineAPI.simpleList(nextProps.projectId).then(list => this.setState({ lineList: list }))
    }
  }

  clickDeleteHandler = (section) => {
    const { onDeleted } = this.props
    confirm({
      title: '删除确认',
      content: `确认删除该标段：${section.name}`,
      onOk: () => {
        sectionAPI.destroy(section.id)
        .then(() => {
          message.success('删除成功')
          onDeleted()
        })
        .catch(() => message.error('删除失败'))
      }
    })
  }

  render () {
    const {
      listData = [],
      displayColumns,
      pagination, // { current, total, pageSize, onChange(page, pageSize) }
      onEdited,
      projectId,
      enabledActions,
      ...restProps
    } = this.props
    const columns = [
      { key: 'lineId', title: '所属线路', dataIndex: 'lineId', render: (v, r, i) => {
        const line = this.state.lineList.filter(item => item.id === v)[0]
        return (line? line.name: '')
      }},
      {
        key: 'lineName', title: '工程名称', dataIndex: 'lineName', render: (v, r, i) => {
          return r.line ? r.line.name : ''
        }
      },
      { key: 'voltageLevel', title: '电压等级（kV）', dataIndex: 'voltageLevel', render: (v, r, i) => {
        const value = r.line ? r.line.voltageLevel : ''
        return value ? window.CVT.VOLTAGE_LEVEL[value].value : ''
      } },
      { key: 'sectionName', title: '设计包段', dataIndex: 'name' },
      { key: 'designer', title: '设计单位', dataIndex: 'designer', render: (v, r, i) => {
        const dept = (r.departments || []).find(d => d.roleId === '0a128045-33ec-11e9-b84e-00163e2ef0cb')
        return dept ? dept.name : ''
      } },
      { key: 'manager', title: '管理单位', dataIndex: 'manager', render: (v, r, i) => {
        const dept = (r.departments || []).find(d => d.roleId === '8ad574ad-4528-11e9-b84e-00163e2ef0cb')
        return dept ? dept.name : ''
      } },
      { key: 'name', title: '标段名称', dataIndex: 'name' },
      { key: 'code', title: '标段编号', dataIndex: 'code' },
      { key: 'length', title: '标段长度', dataIndex: 'length' },
      { key: 'sortNo', title: '排序号', dataIndex: 'sortNo' },
      { key: 'comment', title: '备注', dataIndex: 'comment' },
      { key: 'opts', title: '操作', dataIndex: 'opts' , render: (v, r, i) => {
        const actions = [
          {key : "edit", component : <EditSectionModal key={`edit-${i}`} sectionData={r} onEdited={onEdited} projectId={projectId}><TooltipButton icon="edit" tip="编辑" /></EditSectionModal>},
          {key : "delete", component : <TooltipButton key={`delete-${i}`} icon="delete" type="danger" tip="删除" onClick={() => this.clickDeleteHandler(r)} />}
        ].filter( c => {
          if(enabledActions[0]==='*'){
            return true
          }else{
            return enabledActions.includes(c.key)
          }
        })
        return actions.map( item => {
          return item.component
        })
      }}, // 编辑，删除
    ].filter(c => displayColumns ? displayColumns.includes(c.key) : true)
    return (
      <Table
        rowKey={r => r.id}
        columns={columns}
        dataSource={listData}
        pagination={pagination}
        {...restProps}
      />
    )
  }
}

SectionList.propTypes = {
  listData: PropTypes.array.isRequired,
  onEdited: PropTypes.func,
  onDeleted: PropTypes.func,
  onRecycled: PropTypes.func,
  enabledActions: PropTypes.array,
  displayColumns: PropTypes.array
}

SectionList.defaultProps = {
  listData: [],
  onEdited: noop,
  onDeleted: noop,
  onRecycled: noop,
  enabledActions: ['*']
}
export default SectionList
