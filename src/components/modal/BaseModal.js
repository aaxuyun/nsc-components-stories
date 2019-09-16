import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Modal, Button, message } from 'antd'
import { noop } from '../../utils/func'
import { getWindowSize } from '../../utils/ui'
import DragMove from '../../lib/components/DragMove'

const { height } = getWindowSize()
let zIndex = 200

/**
 * when onOk() returns false or Promise false, then isPrevent is true
 * isPreventClose(onOk).then(isPrevent => {})
 */
const isPreventClose = onOk => {
  onOk = onOk || (() => {})
  return new Promise(resolve => {
    const value = onOk()
    if (value === false) {
      resolve(true)
    } else if (!value) {
      resolve(false)
    } else if (value.then) {
      value.then(r => resolve(r === false))
    }
  })
}


class MovableTitle extends React.Component{
    constructor (props) {
      super(props)
      zIndex ++
    }

    onClicked = () => {
      zIndex ++
      this.modalDom.style.zIndex = zIndex
    }

    updateTransform = transformStr => {
      this.modalDom.style.transform = transformStr
    }

    componentDidMount () {
      const { modal } = this.props
      this.modalDom = ReactDOM.findDOMNode(modal).querySelector('.ant-modal-wrap')
      this.modalDom.style.transform = ''
      this.modalDom.style.pointerEvents = 'none'
      this.modalDom.querySelector('.ant-modal').style.pointerEvents = 'auto'
      this.modalDom.style.zIndex = zIndex
      this.reset()
    }

    reset () {
      this.dragger.reset()
    }

    render(){
      const { title } = this.props
      return (
        <DragMove ref={ref => this.dragger = ref} onClicked={this.onClicked} updateTransform={this.updateTransform}>
          <div>{title}</div>
        </DragMove>
      )
    }
}

class BaseModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  isControlled () {
    return 'visible' in this.props
  }

  componentWillReceiveProps (nextProps) {
    if (this.isControlled() && nextProps.visible && !this.props.visible) {
      this.props.onVisible()
    }
  }

  showModalHandler = () => {
    this.props.onClick()
    this.setState({ visible: true })

    this.props.onVisible()
  }

  hideModalHandler = () => {
    this.setState({ visible: false })
  }

  okHandler = () => {
    message.destroy()
    const result = this.props.onOk()

    if (!this.isControlled()) {
      if (result.then) {
        result.then(r => r !== false && this.hideModalHandler())
      } else if (result !== false) {
        this.hideModalHandler()
      }
    }
  }

  cancelHandler = () => {
    message.destroy()
    if (!this.isControlled()) {
      this.hideModalHandler()
    }
    this.props.onCancel()
  }

  render () {
    const { displayButtons, children, label, title, okText, cancelText, width = 600,
      autoSize, editable, modal, forceRender, ...restProps } = this.props
    const isControlled = this.isControlled()
    const visible = isControlled ? this.props.visible : this.state.visible

    const footerButtons = [
      <Button key='cancel' onClick={this.cancelHandler}>{cancelText}</Button>,
      <Button key='ok' onClick={this.okHandler} type='primary' disabled={!editable}>{okText}</Button>
    ].filter(c => {
      if (displayButtons[0] === '*') {
        return true
      } else {
        return displayButtons.includes(c.key)
      }
    })

    return (
      <span>
        {isControlled ? null : <span onClick={this.showModalHandler}>{label}</span>}
        <Modal
          ref={ref => this.modal = ref}
          {...restProps}
					title={modal ? title : <MovableTitle title={title} modal={this.modal}/>}
					visible={visible}
					onOk={this.okHandler}
					onCancel={this.cancelHandler}
					width={width}
					destroyOnClose={true}
					footer={footerButtons}
          {...(modal || {mask: false, maskClosable: false})}
				>
          <div style={autoSize ? {height: height * 0.60, overflowY: 'auto', overflowX: 'hidden' } : {maxHeight: height * 0.60, overflowY: 'auto', overflowX: 'hidden' }}>
            {forceRender ? children : (visible ? children : null)}
          </div>
        </Modal>
      </span>
    )
  }
}

BaseModal.BaseModal = {
  label: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool,             // visible can be controlled from outside
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onClick: PropTypes.func,
  onVisible: PropTypes.func,
  editable: PropTypes.bool,
  displayButtons: PropTypes.array,
  autoSize: PropTypes.bool,
  modal: PropTypes.bool,
  forceRender: PropTypes.bool
}

BaseModal.defaultProps = {
  label: '弹框',
  title: '无标题',
  onOk: noop,
  onCancel: noop,
  okText: '确认',
  cancelText: '取消',
  onClick: noop,
  onVisible: noop,
  editable: true,
  displayButtons: ['*'],
  autoSize: true,
  modal: true,
  forceRender: true
}

export default BaseModal

/**
 * const modal = openModal({ content, .... })
 * modal.update({ title: 'xx' })
 * modal.close()
 */
export const openModal = ({
  content,
  ...modalProps
}) => {
  const div = window.document.createElement('div')
  window.document.body.appendChild(div)
  let currentProps = {
    ...modalProps,
    visible: true,
    autoSize: true,
    onCancel: modalProps.onCancel || close,
    onOk: modalProps.onOk || close,
    content
  }

  function render ({ content, ...props }) {
    ReactDOM.render(
      <Modal {...props}>
        <div style={props.autoSize ? {height: height * 0.60, overflowY: 'auto', overflowX: 'hidden' } : {maxHeight: height * 0.60, overflowY: 'auto', overflowX: 'hidden' }}>
          {content}
        </div>
      </Modal>,
      div
    )
  }

  function update (updateProps) {
    currentProps = {
      ...currentProps,
      ...updateProps
    }
    render(currentProps)
  }

  function close () {
    currentProps = {
      ...currentProps,
      visible: false,
      afterClose: () => {
        const unmountResult = ReactDOM.unmountComponentAtNode(div)
        if (unmountResult && div.parentNode) {
          div.parentNode.removeChild(div)
        }
      }
    }
    render(currentProps)
  }
  
  render(currentProps)

  return {
    update,
    close
  }
}