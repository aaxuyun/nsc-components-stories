import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Button, message } from 'antd'
import ContextMenu from '@/lib/components/context-menu/ContextMenu'
import ProtocolObjectDetailModal from '@/containers/modals/workbench/protocol/ProtocolObjectDetails'
import { downloadFile } from '@/utils/oss'
import Lightbox from "react-viewer";
import { noop } from '@/utils/func'

class ProtocolTreeItem extends Component {

  constructor (props) {
    super(props)
    this.state = {
      visibleProtocolForm: false,
      visiblePreview: false
    }
  }

  doubleClickHandler = (data) => {
    const fileType = data.attachment.fileType
    if (fileType.indexOf('image') !== -1) {
      this.setState({ visiblePreview: true })
    } else if (fileType.indexOf('pdf') !== -1) {
      window.open(data.attachment.uri)
    } else if (fileType.indexOf('word') !== -1) {
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${data.attachment.uri}`)
    } else {
      message.info('该文件类型不支持预览')
    }
  }

  menuClickHandler = (key) => {
    if (key === '1') {
      const { data } = this.props
      downloadFile(data.attachment.uri, data.attachment.fileName)
    } else if (key === '2') {
      this.setState({ visibleProtocolForm: true })
    }
    this.props.onContextMenuClick(key, this.props.data)
  }

  renderTreeItem () {
    const { data } = this.props
    const menus = [
      { key: '1', title: <span><Icon type="download" /> 下载</span> },
      { key: '2', title: <span><Icon type="info-circle" /> 属性</span> },
      { key: '3', title: <span><Icon type="delete" /> 删除</span> }
    ]

    return (
      <ContextMenu menus={menus} onMenuClick={this.menuClickHandler}>
        <span>{data.name}{data.type!== 'protocol' && `(${data.children.length})`}</span>
      </ContextMenu>
    )
  }

  render () {
    const { data, onUpdate } = this.props
    const { visibleProtocolForm, visiblePreview } = this.state
    return (
      <span onClick={e => e.stopPropagation()} onDoubleClick={() => this.doubleClickHandler(data)} >
        {this.renderTreeItem()}
        <ProtocolObjectDetailModal
          objectId={data.id}
          visible={visibleProtocolForm}
          onCancel={() => this.setState({ visibleProtocolForm: false })}
          onUpdate={onUpdate}
        />
        { data.attachment &&
        <Lightbox
          visible={visiblePreview}
          images={[{src: data.attachment.uri}]}
          onMaskClick={() => this.setState({ visiblePreview: false }) }
          onClose={() => this.setState({ visiblePreview: false })}
          />
        }
      </span>
    )
  }
}

ProtocolTreeItem.propTypes = {
  data: PropTypes.object,
  onUpdate: PropTypes.func,
}

ProtocolTreeItem.defaultProps = {
  onItemClicked: noop
}

export default ProtocolTreeItem
