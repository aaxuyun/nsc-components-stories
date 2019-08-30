import { Component } from "react"
import Table from '@/components/Table'
import TooltipButton from '@/lib/components/TooltipButton'
import PropTypes from 'prop-types'
import { noop } from '@/utils/func'
import { getCvtLabel } from '@/utils/cvt'
import EditLineModal from '@/containers/modals/project/line/EditLine'
import * as lineAPI from '@/apis/lines'
import { message } from 'antd'
import confirm from '@/components/confirm'

class LineList extends Component {

  operateSwitchLine({ text, record, index }) {
    const { onSwitchLine } = this.props
    onSwitchLine({ text, record, index })
  }

  clickDeleteHandler = (line) => {
    const { onDeleted } = this.props
    confirm({
      title: '删除确认',
      content: `确认删除该线路：${line.name}`,
      onOk: () => {
        lineAPI.destroy(this.props.projectId, [line.id])
        .then(() => {
          message.success('删除成功')
          onDeleted()
        })
        .catch(() => message.error('删除失败'))
      }
    })
  }
  
  columnsOperate = (t, r, i) => {
    const { enabledActions, onEdited, projectId } = this.props
    const actions = [
      {key : "switch", component : <TooltipButton key={`switch-${i}`} icon="switcher" tip="切换线路" onClick={ this.operateSwitchLine.bind(this, { t, r, i }) } />},
      {key : "edit", component : <EditLineModal key={`edit-${i}`} lineData={r} onEdited={onEdited} projectId={projectId}><TooltipButton icon="edit" tip="编辑" /></EditLineModal>},
      {key : "delete", component : <TooltipButton key={`delete-${i}`} icon="delete" type="danger" tip="删除" onClick={() => this.clickDeleteHandler(r)} />},
    ].filter(action => {
      if(enabledActions[0]==='*'){
        return true
      }
      return enabledActions.includes(action.key)
    }).map(item => {
      return item.component
    })
    return actions
  }

  columnsList () {
    const { displayColumns } = this.props
    const columns = [
      { title: '名称', dataIndex: 'name' },
      { title: '编码', dataIndex: 'code' },
      { title: '长度', dataIndex: 'length' },
      { title: '电压等级', dataIndex: 'voltageLevel', render: (v, r) => getCvtLabel(v, 'VOLTAGE_LEVEL')},
      { title: '排序号', dataIndex: 'sortNo' },
      // { title: '电流类型', dataIndex: 'currentType' },
      // { title: '杆塔基数', dataIndex: 'towerCount' },
      // { title: '起始地址', dataIndex: 'startAddress' },
      // { title: '终止地址', dataIndex: 'endAddress' },
      // { title: '转角度数', dataIndex: 'cornerDegree' },
      // { title: '是否有回路变化', dataIndex: 'loopType' },
      // { title: '是否公用杆塔', dataIndex: 'sharingTower' },
      // { title: '导线 K 值', dataIndex: 'conductorKValue' },
      // { title: '导线分裂数', dataIndex: 'conductorSplitType' },
      // { title: '分裂导线间隔', dataIndex: 'conductorSplitInter' },
      // { title: '间隔棒距离', dataIndex: 'averIntervalLength' },
      { title: '操作', dataIndex: 'operate', render: this.columnsOperate },
    ].filter((column) =>{
      if (displayColumns[0] === '*') {
        return true
      }
      return displayColumns.includes(column.dataIndex)
    })
    return columns
  }

  render () {
    const {
      listData,
      pagination, 
      keyField,
      ...restProps
    } = this.props

    return (<Table
              rowKey={r => r[keyField]}
              columns={this.columnsList()}
              dataSource={listData}
              pagination={pagination}
              {...restProps}
            />)
  }
}

LineList.propTypes = {
  listData: PropTypes.array.isRequired,
  pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
}

LineList.defaultProps = {
  onSwitchLine: () => {},
  onPaginationChange: () => {},

  keyField: 'id',
  listData: [],
  pagination: false,
  displayColumns: ['*'],  // default to display all columns
  enabledActions: ['*'],
  onDeleted: noop,
  onEdited: noop,
  onRecycled: noop,
  onDisabled: noop,
	onMsgVerify: noop
}

export default LineList