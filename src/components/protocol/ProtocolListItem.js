import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, Icon, Badge, Modal, message } from 'antd'
import { datetimeFormat } from '@/utils/format'
import ContextMenu from '@/lib/components/context-menu/ContextMenu'
import ProtocolObjectDetailModal from '@/containers/modals/workbench/protocol/ProtocolObjectDetails'
import { downloadFile } from '@/utils/oss'
import { noop } from '@/utils/func'
import Lightbox from 'react-viewer'
import 'react-viewer/dist/index.css'

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

class ProtocolListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hover: false,
			visibleProtocolForm: false,
      visiblePreview: false,
    }
  }

  onItemClicked = (item) => {
    const fileType = item.attachment.fileType
    if (fileType.indexOf('image') !== -1) {
      this.setState({ visiblePreview: true })
    } else if (fileType.indexOf('pdf') !== -1) {
      window.open(item.attachment.uri)
    } else if (fileType.indexOf('word') !== -1) {
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${item.attachment.uri}`)
    } else {
      message.info('该文件类型不支持预览')
    }
  }

  menuClickHandler = key => {
    if (key === '1') {
			const { item } = this.props
      downloadFile(item.attachment.uri, item.attachment.fileName)
    } else if (key === '2') {
      this.setState({ visibleProtocolForm: true })
    }
    this.props.onContextMenuClick(key, this.props.item)
  }

  toggleHover = (status) => {
    this.setState({ hover: status })
  }

  renderTypeName = (value) => {
    let type = window.CVT.PROTOCOL_TYPE[value]
    if (type) {
      return `[${type.value}]`
    } else {
      return `[未知]`
    }
  }

  renderProtocolLevelBadge = (value) => {
    let type = window.CVT.PROTOCOL_LEVEL[value]
    if (type) {
      return <div style={{ backgroundColor: type.value2, width: 10, height: 10, borderRadius: '50%', marginRight: 5 }}/>
    } else {
      return null
    }
  }

  renderFileType = (value) => {
    let icon = getFileTypeIcon(value)
    return <Icon style={{marginRight: 5}} type={icon} />
  }

  render () {
    const { item, onUpdate, textConfigList } = this.props
    const { hover, visibleProtocolForm, visiblePreview } = this.state

    let bgColor
    if (hover) {
      bgColor = 'rgba(11, 202, 197, 0.3)'
    } else {
      bgColor = '#fff'
    }

    const menus = [
      { key: '1', title: <span><Icon type="download" /> 下载</span> },
      { key: '2', title: <span><Icon type="info-circle" /> 属性</span> },
      { key: '3', title: <span><Icon type="delete" /> 删除</span> }
    ]

    return (
      <span onClick={e => e.stopPropagation()}>
				<ContextMenu menus={menus} onMenuClick={this.menuClickHandler}>
					<List.Item
						onMouseEnter={() => this.toggleHover(true)}
						onMouseLeave={() => this.toggleHover(false)}
						onClick={() => this.onItemClicked(item)}
						style={{ paddingLeft: 5, paddingRight: 5, backgroundColor: bgColor, cursor: 'pointer'}}
					>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
							{this.renderProtocolLevelBadge(item.level)}
              {this.renderFileType(item.attachment.fileType)}
              <div style={{flex: 1, width: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}} title={item.name}>
                {`${this.renderTypeName(item.type)}${item.name}`}
  						</div>
              <div style={{marginLeft: 5, width: 40}}>
                {(item.attachment.fileSize/1024/1024).toFixed(2) + 'M'}
              </div>
            </div>
					</List.Item>
				</ContextMenu>
				<ProtocolObjectDetailModal
					objectId={item.id}
					visible={visibleProtocolForm}
					textConfigList={textConfigList}
					onCancel={() => this.setState({ visibleProtocolForm: false })}
					onUpdate={onUpdate}
				/>
        { item &&
          <Lightbox
            visible={visiblePreview}
            images={[{src: item.attachment.uri}]}
            onMaskClick={() => this.setState({ visiblePreview: false }) }
            onClose={() => this.setState({ visiblePreview: false })}
          />
        }
			</span>
    )
  }
}

ProtocolListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onItemClicked: PropTypes.func,
	onUpdate: PropTypes.func,

}

ProtocolListItem.defaultProps = {
  onItemClicked: noop
}

export default ProtocolListItem
