import co from 'co'
import { Component } from "react"
import { Form, Input, Upload, message, Row, Col, Icon, DatePicker, Modal } from "antd"
import { PROGRESS_IMAGE_SIZE } from '@/constants'
import { getSTSClient, encodeFileName } from '@/utils/oss'
import PropTypes from 'prop-types'
import { isEqual, omit } from 'lodash'
import styles from './uploadfile.css'

const accept = ['.pdf', '.xlsx', '.xltx', '.potx', '.ppsx', '.pptx', '.sldx', '.docx', '.dotx', '.xlsm', '.xlsb' ]

const toFile = attachment => ({
  uid: attachment.id,
  // id: attachment.id,
  name: attachment.fileName,
  encodedFileName: attachment.encodedFileName,
  url: attachment.uri,
  size: attachment.fileSize,
  ext: attachment.fileExt,
  type: attachment.fileType
})

const toAttachment = file => ({
  // id: file.id || file.uid,
  fileName: file.name,
  encodedFileName: file.encodedFileName,
  fileSize: file.size,
  fileType: file.type,
  fileExt: file.ext,
  uri: file.url
})

class UploadFile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      listType: 'picture-card',
      fileList: [], // [{ id, name, encodeFileName, size, type, ext, uid, url }]
    }
  }

  componentDidMount () {
    const { images } = this.props
    this.setState({ fileList: images.map(toFile) }, ()=>{ 
      const { onChange } = this.props
      onChange(this.state.fileList.map(toAttachment))
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handleChange = fileList => {
    const { onChange } = this.props
    onChange(fileList.map(toAttachment))
  }

  handlePreview = (file) => {
    if (accept.join(',').indexOf(file.ext) !== -1) {
      window.open(file.url)
      return
    }

    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleRemove = (file) => {
    const { fileList } = this.state
    const newFileList = fileList.filter(f => f.uid !== file.uid)
    this.setState({ fileList: newFileList })
    this.handleChange(newFileList)
  }

  beforeUpload = (file) => {
    const { fileList } = this.state
    const ext = file.name.split('.').pop()
    const fileSize = 100

    if (fileList.length >= PROGRESS_IMAGE_SIZE) {
      message.error(`文件数量过多，最多可上传${PROGRESS_IMAGE_SIZE}张`)
      return false
    }

    const isLt10M = file.size / 1024 / 1024 < fileSize
    if (!isLt10M) {
      message.error(ext + '文件要小于'+ fileSize +'M!')
      return false
    }

    const hideLoading = message.loading(ext + '文件正在预处理', 0)
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
        ext: ext,
        type: file.type
      }

      return newFile
    }).then(newFile => {
      fileList.push(newFile)
      this.setState({ fileList })
      this.handleChange(fileList)
      hideLoading()
    }).catch(e => {
      console.error('ImageUploader error', e)
      message.error(`${file.name} 预处理失败`)
      hideLoading()
    })
  
    return false
  }

  showUploadList = () => {
    const { disabled } = this.props
    if (disabled) {
      return { showPreviewIcon: true, showRemoveIcon: false }
    } 
  }


  render () {
    const { fileList, previewVisible, previewImage, listType } = this.state
    const { disabled } = this.props
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传文件</div>
      </div>
    )
    return (
      <div>
        <Upload
          showUploadList={this.showUploadList()}
          disabled={disabled}
          className={styles.uploadPdfStyle}
          beforeUpload={this.beforeUpload}
          listType={listType}
          fileList={fileList}
          onPreview={this.handlePreview}
          onRemove ={this.handleRemove}
          accept={accept.join(',') + ',image/*' }
          multiple={true}
        >
          {(fileList.length >= PROGRESS_IMAGE_SIZE || disabled) ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

UploadFile.propTypes = {
  projectId: PropTypes.string, 
  progressDetailId: PropTypes.string, 
  onChange: PropTypes.func,
  images: PropTypes.array
}

UploadFile.defaultProps = {
  images: [],
  disabled: false,
  onChange: () => {}
}

export default UploadFile