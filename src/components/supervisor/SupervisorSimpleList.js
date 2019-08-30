import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, Icon, Modal, message } from 'antd'
import { noop } from '@/utils/func'
import SupervisorSimpleListItem from './SupervisorSimpleListItem'

const { confirm } = Modal

class SupervisorSimpleList extends Component{
  onItemClicked = item => {
    const { onItemClicked } = this.props
    onItemClicked && onItemClicked(item)
  }

  renderItem = (item) => {
    const { displayFields, showReadColor } = this.props
    return <SupervisorSimpleListItem item={item} showReadColor={showReadColor} onItemClicked={this.onItemClicked} displayFields={displayFields}/>
  }

  render () {
    const { listData, pagination } = this.props
    return (
      <List
        bordered
        size="small"
        itemLayout="horizontal"
        dataSource={listData}
        pagination={pagination}
        renderItem={this.renderItem}
      />
    )
  }
}

SupervisorSimpleList.propTypes = {
  listData: PropTypes.array.isRequired,
  pagination: PropTypes.object,
  onItemClicked: PropTypes.func,
  onDeleted: PropTypes.func
}

SupervisorSimpleList.defaultProps = {
  listData: [],
  onItemClicked: noop,
  onDeleted: noop
}

export default SupervisorSimpleList
