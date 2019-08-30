import React from 'react'
import { Button, Modal, message } from 'antd'
import Table from '@/components/Table'
import EditCvtValueModal from '@/containers/modals/project/cvt/EditCvtValue'
import { destroyCvtValue } from '@/apis/cvts'

const { confirm } = Modal

const CvtList = ({
  listData = [],
  pagination, // { current, total, pageSize, onChange(page, pageSize) }
  cvtType,
  projectId,
  onEdited,
  onDeleted,
  ...restProps
}) => {
  const clickDeleteHandler = record => () => {
    confirm({
      title: '删除确认',
      content: '确认删除当前字典条目数据？',
      onOk () {
        destroyCvtValue(record, projectId).then(() => {
          message.success('删除成功')
          onDeleted()
        }).catch(() => {
          message.error('删除失败')
        })
      }
    })
  }

  const columns = [
    { key: 'value', title: '文字内容', dataIndex: 'value' },
    { key: 'comment', title: '备注', dataIndex: 'comment' },
    { key: 'sortNo', title: '排序号', dataIndex: 'sortNo' },
    { key: 'opts', title: '操作', dataIndex: 'opts', render: (v, r) => {
      return (
        <span>
          <EditCvtValueModal cvtData={r} cvtType={cvtType} projectId={projectId} onEdited={onEdited}>
            <Button icon="edit" />
          </EditCvtValueModal>
          <Button type="danger" icon="delete" onClick={clickDeleteHandler(r)} />
        </span>
      )
    } }
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

export default CvtList
