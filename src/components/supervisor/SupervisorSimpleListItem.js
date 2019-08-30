import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, Icon, Badge } from 'antd'
import { datetimeFormat } from '@/utils/format'

const getFileTypeIcon = (fileType) => {
  if (fileType.indexOf('image') !== -1) {
    return 'picture'
  } else if (fileType.indexOf('pdf') !== -1) {
    return 'file-pdf'
  } else if (fileType.indexOf('word') !== -1) {
    return 'file-word'
  } else {
    return 'file-unknown'
  }
}

class SupervisorSimpleListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hover: false,
      visible: false
    }
  }

  onItemClicked = (e) => {
     e.stopPropagation()
     this.setState({ visible: true })
     const { onItemClicked, item } = this.props
     onItemClicked && onItemClicked(item)
  }

  toggleHover = (status) => {
    this.setState({ hover: status })
  }

  renderFileType = (supervisorData) => {
    if (!supervisorData.attachment) {
      return <Icon style={{marginRight: 5}} type='message' />
    }
    const fileType = supervisorData.attachment.fileType
    let icon = getFileTypeIcon(fileType)
    return <Icon style={{marginRight: 5}} type={icon} />
  }

  render () {
    const { item, showReadColor } = this.props
    const { hover } = this.state
    let bgColor
    if (hover) {
      bgColor = 'rgba(11, 202, 197, 0.3)'
    } else {
      bgColor = '#fff'
    }
    const textColor = (showReadColor && !(item.userRead && item.userRead.isRead === 0)) && 'silver'

    return (
      <span onClick={e => e.stopPropagation()}>
        <List.Item
          onMouseEnter={() => this.toggleHover(true)}
          onMouseLeave={() => this.toggleHover(false)}
          onClick={this.onItemClicked}
          style={{ paddingLeft: 10, paddingRight: 10, backgroundColor: bgColor, cursor: 'pointer'}}
        >
          <div style={{display: 'flex', flexDirection: 'column', width: '100%', color: textColor}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              {(item.userRead && item.userRead.isRead === 0) && <Badge status="error"/>}
              {this.renderFileType(item)}
              <div style={{flex: 1, width: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}} title={item.title}>
                {item.title}
              </div>
            </div>
            <div style={{marginTop: 10}}>{item.createdAt}</div>
          </div>
        </List.Item>
      </span>
    )
  }
}

SupervisorSimpleListItem.propTypes = {
  item: PropTypes.object.isRequired,
  userReadList: PropTypes.array,
  showReadColor: PropTypes.bool
}

SupervisorSimpleListItem.defaultProps = {
  userReadList: [],
  showReadColor: true,
}

export default SupervisorSimpleListItem
