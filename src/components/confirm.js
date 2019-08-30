import { Modal } from 'antd'

export default ({ okText = '确认', cancelText = '取消', ...rest }) => {
  Modal.confirm({
    okText,
    cancelText,
    ...rest
  })
}
