import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message, Tooltip, Icon } from 'antd'
import TooltipButton from '@/lib/components/TooltipButton'
import TextEllipsis from '@/lib/components/TextEllipsis'
import Table from '@/components/Table'
import ProtocolObjectDetailModal from '@/containers/modals/workbench/protocol/ProtocolObjectDetails'
import { downloadFile } from '@/utils/oss'
import Lightbox from 'react-viewer'
import styles from './Protocol.css'
import 'react-viewer/dist/index.css'

const getCvtLabel = (code, key) => {
  if (window.CVT[code] && window.CVT[code][key]) {
    return window.CVT[code][key].value
  } else {
    return ''
  }
}

class ProtocolDetailList extends Component {

  state = {
    visiblePreview: false,
    protocolData: null
  }

  onPreview = (protocolData) => {
    const fileType = protocolData.attachment.fileType
    if (fileType.indexOf('image') !== -1) {
      this.setState({ visiblePreview: true, protocolData })
    } else if (fileType.indexOf('pdf') !== -1) {
      window.open(protocolData.attachment.uri)
    } else {
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${protocolData.attachment.uri}`)
    }
  }

  onDownload = (protocolData) => {
    downloadFile(protocolData.attachment.uri, protocolData.attachment.fileName)
  }

  clickDeleteHandler = (item) => {
    const { onDeleted } = this.props
    onDeleted && onDeleted(item)
  }

  render () {
    const { visiblePreview, protocolData } = this.state
    const {
      listData = [],
			enabledActions,
			deptSelectList,
			pagination,
			protocolValid,
      onUpdate,
      ...restProps
    } = this.props
    const columns = [
      { key: 'name', title: '协议名称', align: 'center', dataIndex: 'name' },
      /* { key: 'deptId', title: '所属设计院', align: 'center', dataIndex: 'deptId', render: (v, r, i) => {
        if (deptSelectList.length > 0) {
          const dept = deptSelectList.find(item => item.id === v)
          return dept ? dept.name : ''
        } else {
          return r.department ? r.department.name : ''
        }
      }
      }, */
      { key: 'type', title: '协议类型', align: 'center', dataIndex: 'type' , render: (v, r, i) => {
        return getCvtLabel('PROTOCOL_TYPE', v)
        }
      },
      { key: 'level', title: '协议级别', align: 'center', dataIndex: 'level' , render: (v, r, i) => {
        return getCvtLabel('PROTOCOL_LEVEL', v)
      }
      },
			{ key: 'demand', title: '特殊要求', align: 'center', dataIndex: 'demand' , render: (v, r, i) => {
				return <TextEllipsis overflowStyle={{color: 'blue', cursor: 'pointer'}} text={v || '无'} />
      } },
      { key: 'isValidity', title: '有效性', align: 'center', dataIndex: 'isValidity' , render: (v, r, i) => {
				return v === 1 ? '有效' : '无效'
      }
      },
			{ key: 'condition', title: '落实情况', align: 'center', dataIndex: 'condition' , render: (v, r, i) => {
				return <TextEllipsis overflowStyle={{color: 'blue', cursor: 'pointer'}} text={v || '无'} />
      } },
      { key: 'other', title: '其他要求', align: 'center', dataIndex: 'other' },
      { key: 'createAt', title: '上传时间', align: 'center', dataIndex: 'createdAt' },
      { key: 'opts', title: '操作', dataIndex: 'opts', align: 'center' ,width:'150px', render: (v, r, i) => {
        const actions = [
          {key : "edit", component : <ProtocolObjectDetailModal key={`edit-${i}`} objectId={r.id} onUpdate={onUpdate}><TooltipButton icon="edit" tip="编辑" /></ProtocolObjectDetailModal>},
          {key : "delete", component : <TooltipButton key={`delete-${i}`} icon="delete" type="danger" tip="删除" onClick={() => this.clickDeleteHandler(r)} />},
          {key : "eye", component : <TooltipButton key={0} icon="eye" tip="预览" onClick={() => this.onPreview(r)} />},
          {key : "download", component : <TooltipButton key={1} icon="download" tip="下载" onClick={() => this.onDownload(r)}/>},
        ].filter( c => {
          if(enabledActions[0]==='*'){
            return true
          }else{
            return enabledActions.includes(c.key)
          }
        })
        return actions.map( item => {
          return item.component
        })
      }
      },
    ]

    return (
		<div>
      <div className={styles.protocolTable}>
        <Table
          rowKey={r => r.id}
          columns={columns}
          dataSource={listData}
  				pagination={pagination}
          {...restProps}
        />
        { protocolData &&
          <Lightbox
            visible={visiblePreview}
  					images={[{src: protocolData.attachment.uri}]}
            onMaskClick={() => this.setState({ visiblePreview: false }) }
  					onClose={() => this.setState({ visiblePreview: false })}
  				/>
        }
      </div>
			{protocolValid && <Tooltip title={protocolValid}><span style={{color: 'red'}}><Icon type="exclamation-circle" />有效性说明</span></Tooltip>}
		</div>
    )
  }
}

ProtocolDetailList.propTypes = {
  listData: PropTypes.array.isRequired,
  deptSelectList: PropTypes.array,
	enabledActions: PropTypes.array
}

ProtocolDetailList.defaultProps = {
  listData: [],
  deptSelectList: [],
	enabledActions: ['*']
}
export default ProtocolDetailList
