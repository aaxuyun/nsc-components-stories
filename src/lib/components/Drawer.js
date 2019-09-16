import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Icon } from 'antd'
import DynamicMountComponent from './DynamicMountComponent'

/**
 * props.title
 * props.onClose
 */
class Drawer extends Component {

  handleClose = () => {
    const { onClose } = this.props
    this.root.classList.add('is-leaving')
    setTimeout(() => {
      this.root.classList.remove('is-leaving')
      onClose && onClose()
    }, 300)
  }

  render () {
    const { title = '详细信息', children, onClose, ...restProps } = this.props
    return (
      <ReactCSSTransitionGroup
        transitionName="drawer-anim"
        transitionAppear={true}
        transitionAppearTimeout={300}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >

      <div className="c-drawer" {...restProps} ref={root => this.root = root}>
        <div className="c-drawer__header">
          <h4 className="c-drawer__title">{title}</h4>
          <Icon type="close" style={{display:'flex',alignItems:'center',justifyContent:'center'}} className="c-drawer__closeBtn" onClick={this.handleClose} />
        </div>
        <div className="c-drawer__body">
          <div className="c-drawer__content">
            {children}
          </div>
        </div>
      </div>

      </ReactCSSTransitionGroup>
    )
  }
}

Drawer.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func
}

Drawer.defaultProps = {
  onClose: () => {}
}

/**
 * props.visible
 * ... Drawer.props
 */
export default class Wrapper extends Component {

  constructor (props) {
    super(props)
    this.state = {
      visible: props.visible || false
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      visible: nextProps.visible
    })
  }

  handleClose = () => {
    const { onClose } = this.props
    onClose ? onClose() : this.setState({ visible: false })
  }

  render () {
    const { children, ...restProps } = this.props
    const { visible } = this.state

    return (
      <DynamicMountComponent
        visible={visible}
        component={Drawer}
        onClose={this.handleClose}
        {...restProps}
      >
        {children}
      </DynamicMountComponent>
    )
  }
}
