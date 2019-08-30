import styles from './GroundObjectImageManager.css'
import { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import PropTypes from 'prop-types'
import { MAX_UPLOADIMAGE_SIZE } from '@/constants'
import { noop } from '@/utils/func'
import { getSTSClient, encodeFileName } from '@/utils/oss'
import co from 'co'

const toFile = attachment => ({
  uid: attachment.id,
  id: attachment.id,
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

class GroundObjectImageManager extends Component {
  constructor (props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [], // [{ id, name, encodeFileName, size, type, ext, uid, url }]
      stsToken: null
    }
  }

  componentDidMount () {
    const { images } = this.props
    this.setState({ fileList: images.map(toFile) })
  }
  
  handleChange = fileList => {
    const { onChange } = this.props
    onChange(fileList.map(toAttachment))
  }

  handleRemove = (file) => {
    const { fileList } = this.state
    const newFileList = fileList.filter(f => f.id !== file.id)

    this.setState({ fileList: newFileList })
    this.handleChange(newFileList)
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  //文件先上传至阿里云
  beforeUpload = (file) => {
    const { fileList } = this.state

    if (fileList.length >= MAX_UPLOADIMAGE_SIZE) {
      message.error(`图片数量过多，最多可上传${MAX_UPLOADIMAGE_SIZE}张`)
      return false
    }

    const hideLoading = message.loading('图片正在预处理', 0)
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
      this.handleChange(fileList)
      hideLoading()
    }).catch(e => {
      console.error('ImageUploader error', e)
      message.error(`${file.name} 预处理失败`)
      hideLoading()
    })

    // not do the upload after image added
    return false
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className={styles.block}>
        <Upload
          action=''
          beforeUpload={this.beforeUpload}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onRemove ={this.handleRemove}
          accept="image/*"
          multiple={true}
        >
          {fileList.length >= MAX_UPLOADIMAGE_SIZE ? null : uploadButton}
        </Upload>
        <Modal 
          visible={previewVisible} 
          footer={null} 
          onCancel={this.handleCancel} 
          width='80%'>
          <img alt="image" style={{ width: '100%', height : '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

GroundObjectImageManager.propTypes = {
  images: PropTypes.array,
  onChange: PropTypes.func
}

GroundObjectImageManager.defaultProps = {
  images: [],
  onChange: noop
}


export default GroundObjectImageManager