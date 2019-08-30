import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import TooltipButton from '@/lib/components/TooltipButton'
import Table from '@/components/Table'
import TextEllipsis from '@/lib/components/TextEllipsis'
import { noop } from '@/utils/func'
import { downloadFile } from '@/utils/oss'
import SupervisorDetailModal from '@/containers/modals/workbench/supervisor/SupervisorDetailModal'
import Lightbox from 'react-viewer'
import 'react-viewer/dist/index.css'

class SupervisorList extends Component {

  state = {
    visiblePreview: false,
    supervisorData: null
  }

  onPreview = (supervisorData) => {
    if (!supervisorData.attachment) {
      return message.info('该条记录无附件文件')
    }
    const fileType = supervisorData.attachment.fileType
    if (fileType.indexOf('image') !== -1) {
      this.setState({ visiblePreview: true, supervisorData })
    } else if (fileType.indexOf('pdf') !== -1) {
      window.open(supervisorData.attachment.uri)
    } else if (fileType.indexOf('word') !== -1) {
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${supervisorData.attachment.uri}`)
    } else {
      message.info('该文件类型不支持预览')
    }
  }

  onDownload = (supervisorData) => {
    if (!supervisorData.attachment) {
      return message.info('该条记录无附件文件')
    }
    downloadFile(supervisorData.attachment.uri, supervisorData.attachment.fileName)
  }

  render () {
    const { visiblePreview, supervisorData } = this.state
    const {
      listData = [],
      pagination, // { current, total, pageSize, onChange(page, pageSize) }
      projectId,
      onEdited,
      displayColumns,
      enabledActions,
      departments,
      userDepartment,
      ...restProps
    } = this.props

    const columns = [
      { key: 'title', title: '标题', dataIndex: 'title', render: (v, r) => {
        return <TextEllipsis overflowStyle={{color: 'blue', cursor: 'pointer'}} text={v} />
      }},
      { key: 'sDeptId', title: '发送部门', dataIndex: 'sDeptId', render: (v, r) => {
          return v === userDepartment.id ? userDepartment.name : ''
        }},
      { key: 'createdUserName', title: '发送人', dataIndex: 'createdUserName'},
      { key: 'rDeptIds', title: '接收部门', dataIndex: 'rDeptIds', render: (v, r) => {
        const deptNames = v.split(',').map(item => {
          const dept = departments.find(dept => dept.id === item)
          return dept ? dept.name : ''
        }).join(', ')
        return (
          <SupervisorDetailModal supervisorData={r} displayFields={['baseInfo', 'userReadInfo']}>
            <TextEllipsis
              style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}
              overflowStyle={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}
              text={deptNames}
            />
          </SupervisorDetailModal>
        )
      }},
      { key: 'comment', title: '备注', dataIndex: 'comment' , render: (v, r) => {
          return <TextEllipsis overflowStyle={{color: 'blue', cursor: 'pointer'}} text={v} />
      }},
      { key: 'createdAt', title: '发送时间', dataIndex: 'createdAt' },
      { key: 'opts', title: '操作', dataIndex: 'opts', render: (v, r, i) => {
        const actions = [
          { key: 'eye', component: <TooltipButton key={0} icon="eye"  tip="预览" onClick={() => this.onPreview(r)} /> },
          { key: 'download', component: <TooltipButton key={1} icon="download"  tip="下载" onClick={() => this.onDownload(r)} /> },
        ].filter(c => {
          if (enabledActions[0] === '*') {
            return true
          } else {
            return enabledActions.includes(c.key)
          }
        })
        return actions.map( item => {
          return item.component
        })
      } }
    ].filter(c => {
      if (displayColumns[0] === '*') {
        return true
      } else {
        return displayColumns.includes(c.key)
      }
    })
      return (
        <div>
          <Table
            rowKey={r => r.id}
            columns={columns}
            dataSource={listData}
            pagination={pagination}
            {...restProps}
          />
        { supervisorData &&
          <Lightbox
            visible={visiblePreview}
            images={[{src: supervisorData.attachment.uri}]}
            onMaskClick={() => this.setState({ visiblePreview: false }) }
            onClose={() => this.setState({ visiblePreview: false })}
          />
        }
      </div>
    )
  }
}

SupervisorList.propTypes = {
  displayColumns: PropTypes.array,
  enabledActions: PropTypes.array,
  onEdited: PropTypes.func,
  onDeleted: PropTypes.func,
}

SupervisorList.defaultProps = {
  displayColumns: ['*'],
  enabledActions: ['*'],
  onEdited: noop,
  onDeleted: noop,
}

export default SupervisorList
