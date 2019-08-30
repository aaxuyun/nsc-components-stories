import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, Icon, Modal, message } from 'antd'
import { noop } from '@/utils/func'
import * as protocolAPI from '@/apis/protocols'
import ProtocolListItem from './ProtocolListItem'

const { confirm } = Modal

class ProtocolList extends Component{
  constructor (props) {
    super(props)
    this.state = {
      hover: false
    }
  }

  contextMenuClickHandler = (menuKey, item) => {
    if (menuKey === '3') {
      confirm({
        title: '删除确认',
        content: `确认删除协议[${item.name}]`,
        onOk: () => {
          protocolAPI.destroy(item.id)
          .then(() => {
            const { onDeleted } = this.props
            onDeleted && onDeleted()
            message.success('删除成功')
          })
          .catch(() => message.error('删除失败'))
        }
      })
    }
  }

  renderItem = (item) => {
		const { onUpdate, textConfigList } = this.props
    return (
      <ProtocolListItem
        item={item}
        onContextMenuClick={this.contextMenuClickHandler}
				onUpdate={onUpdate}
				textConfigList={textConfigList}
      />
    )
  }

  render () {
    const { listData, pagination } = this.props
    return (
      <List
        bordered
        size='small'
        style={{height: '100%', overflow: 'auto'}}
        itemLayout="horizontal"
        dataSource={listData}
        pagination={pagination}
        renderItem={this.renderItem}
      />
    )
  }
}

ProtocolList.propTypes = {
  listData: PropTypes.array.isRequired,
  pagination: PropTypes.object,
  onDeleted: PropTypes.func,
	onUpdate: PropTypes.func,
}

ProtocolList.defaultProps = {
  listData: [],
  onDeleted: noop,
}

export default ProtocolList
