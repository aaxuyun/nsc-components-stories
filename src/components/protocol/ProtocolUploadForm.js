import React, { Component } from 'react'
import PropTypes from 'prop-types'
import co from 'co'
import { Upload, Icon, Modal, message } from 'antd'
import { noop } from '@/utils/func'
import { getSTSClient, encodeFileName } from '@/utils/oss'
import { MAX_UPLOADIMAGE_SIZE, MAX_UPLOADIMAGE_FILESIZE } from '@/constants'
import { isEqual, omit } from 'lodash'
const { Dragger } = Upload

const toAttachment = file => ({
  id: file.id || file.uid,
  fileName: file.name,
  encodedFileName: file.encodedFileName,
  fileSize: file.size,
  fileType: file.type,
  fileExt: file.ext,
  uri: file.url
})

class ProtocolUploadForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fileList: [], // [{ id, name, encodeFileName, size, type, ext, uid, url }]
      stsToken: null
    }
  }

	getFileList = () => {
		return this.state.fileList.map(toAttachment)
	}

  //文件先上传至阿里云
  beforeUpload = (file) => {
    const { fileList } = this.state

    if (fileList.length >= MAX_UPLOADIMAGE_SIZE) {
      message.error(`文件数量过多，最多可上传${MAX_UPLOADIMAGE_SIZE}个`)
      return false
    }

    if (file.size > MAX_UPLOADIMAGE_FILESIZE) {
      message.error(`${file.name}文件体积过大，单个文件不可超过${MAX_UPLOADIMAGE_FILESIZE/1024/1024}MB`)
      return false
    }

    const hideLoading = message.loading(`正在上传文件 ${file.name}`, 0)
    let encodedFileName

    getSTSClient().then(uploadClient => {
      encodedFileName = encodeFileName(file.name)
      return co(function* () {
        return yield uploadClient.put(encodedFileName, file)
      })
    }).then(aliRes => {
      const newFile = {
        uid: file.uid,
        id: file.uid,
        encodedFileName,
        name: file.name,
        url: aliRes.url,
        size: file.size,
        ext: file.name.split('.').pop(),
        type: file.type
      }
			return newFile
    }).then(newFile => {
      fileList.push(newFile)
      this.setState({ fileList })
      hideLoading()
    }).catch(e => {
      console.error('ProtocolUploadForm error', e)
      message.error(`${file.name} 文件上传失败`)
      hideLoading()
    })

    // not do the upload after image added
    return false
  }

	render () {
    const props = {
      name: 'kml',
      multiple: true,
      action: '',
			beforeUpload: this.beforeUpload,
      onChange: this.uploadChangeHandler,
			accept: "image/*, .pdf, .doc, .docx, .xlsx, .xls, .csv",
      fileList: this.state.fileList,
    }

    return (
      <div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" style={{color:'#3db389'}}/>
          </p>
          <p className="ant-upload-text">点击获取拖动 图片或文档 到这块区域完成协议上传</p>
        </Dragger>
      </div>
    )
  }
}

ProtocolUploadForm.propTypes = {

}

ProtocolUploadForm.defaultProps = {

}

export default ProtocolUploadForm
