import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table from '@/components/Table'
import { message } from 'antd'
import TooltipButton from '@/lib/components/TooltipButton'
import EditProtocolProgressModal from '@/containers/modals/workbench/protocol/EditProtocolProgress'
import confirm from '@/components/confirm'
import * as protocolProgressAPI from '@/apis/protocol-progress'
import { noop } from '@/utils/func'

class ProtocolProgressList extends Component{

  clickDeleteHandler = (proj) => {
		const { onDeleted } = this.props
    confirm({
      title: '删除确认',
      content: `确认删除：${proj.line}`,
      onOk: () => {
        protocolProgressAPI.destroy(proj.id)
        .then(() => {
					onDeleted && onDeleted()
          message.success('删除成功')
        })
        .catch(() => message.error('删除失败'))
      }
    })
  }

  render () {
    const {
      listData = [],
			onEdited,
			provinceList,
      pagination, // { current, total, pageSize, onChange(page, pageSize) }
      ...restProps
    } = this.props
    const columns = [
      { key: 'line', title: '线路段', dataIndex: 'line' },
      { key: 'province', title: '所在省份', dataIndex: 'province', render: (v, r, i) => {
					if(!v){
						return null
					}
					const provinceData = provinceList.filter(r => v.indexOf(r.id) !== -1)
					const nameList = provinceData.map(item => item.name)
					return nameList.join(', ')
				}
			},
      { key: 'allCount', title: '可研协议总数', dataIndex: 'allCount' },
      { key: 'comCount', title: '已完成协议总数', dataIndex: 'comCount' },
      { key: 'opts', title: '操作', dataIndex: 'opts' , render: (v, r, i) => {
        const actions = [
          {key : "edit", component : <EditProtocolProgressModal key={`edit-${i}`} formData={r} onEdited={onEdited}><TooltipButton icon="edit" tip="编辑" /></EditProtocolProgressModal>},
          {key : "delete", component : <TooltipButton key={`delete-${i}`} icon="delete" type="danger" tip="删除" onClick={() => this.clickDeleteHandler(r)} />}
        ]
        return actions.map( item => {
          return item.component
        })
      }
      },
    ]
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

ProtocolProgressList.propTypes = {
  listData: PropTypes.array.isRequired,
	provinceList: PropTypes.array,
  onDeleted: PropTypes.func,
}

ProtocolProgressList.defaultProps = {
  listData: [],
	provinceList: [],
  onDeleted: noop,
}
export default ProtocolProgressList
