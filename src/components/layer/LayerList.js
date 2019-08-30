import React from 'react'
import { Button } from 'antd'
import Table from '@/components/Table'
import { datetimeFormat } from '@/utils/format'

const LayerList = ({
  listData = [],
  pagination, // { current, total, pageSize, onChange(page, pageSize) }
  layerTypes,
  ...restProps
}) => {
  const columns = [
    { key: 'name', title: '图层名称', dataIndex: 'name' },
    { key: 'remark', title: '图层备注', dataIndex: 'remark' },
    { key: 'type', title: '图层类型', dataIndex: 'type' },
    { key: 'mapServerUrl', title: '图层地址', dataIndex: 'mapServerUrl' },
    { key: 'offlinePackageUrl', title: '离线包地址', dataIndex: 'offlinePackageUrl' },
    { key: 'packagePassword', title: '离线包解压密码', dataIndex: 'packagePassword' },
    { key: 'category', title: '图层归类', dataIndex: 'category' },
    { key: 'sortNo', title: '排序号', dataIndex: 'sortNo' },
    { key: 'opts', title: '操作', dataIndex: 'opts', render: (v, r) => {
      return (
        <Button icon="edit" />
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

export default LayerList
