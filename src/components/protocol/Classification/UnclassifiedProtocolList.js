import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, List, message } from 'antd'
import ProtocolList from '@/components/protocol/ProtocolList'
import { MAX_SELECTION_SIZE } from '@/constants'
import { isEqual } from 'lodash'
import { noop } from '@/utils/func'

class UnclassifiedProtocolList extends Component{
  constructor (props) {
    super(props)

    this.state = {
      pageSize: 10,
      selectedRowKeys: [],
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.listData, this.props.listData)) {
      this.setState({ selectedRowKeys: [] })
      const { onSelectChange } = this.props
      onSelectChange && onSelectChange([])
    }
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
    const { onSelectChange } = this.props
    onSelectChange && onSelectChange(selectedRowKeys)
  }

  render () {
    const columns = [
      { key: 'name', title: '协议名称', dataIndex: 'name' },
    ]

    const { pageSize, selectedRowKeys } = this.state
    const { listData = [], onSelectChange, ...restProps } = this.props
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <Table
        size='small'
        bordered={false}
        scroll={{ y: 400 }}
        rowKey={r => r.id}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={listData}
        pagination={{
          position: 'top',
          pageSize
        }}
        {...restProps}
      />
    )
  }
}

UnclassifiedProtocolList.propTypes = {
  onSelectChange: PropTypes.func
}

UnclassifiedProtocolList.defaultProps = {
  onSelectChange: noop
}

export default UnclassifiedProtocolList
