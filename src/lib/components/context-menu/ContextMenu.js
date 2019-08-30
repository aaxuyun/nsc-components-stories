import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Menu from '@/lib/components/Menu'
import Trigger from 'rc-trigger'
import 'rc-trigger/assets/index.css'
import { noop } from '@/utils/func'
import styles from './ContextMenu.css'

class ContextMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pageX: null,
      pageY: null,
      visible: false
    }
  }

  contextMenuHandler = e => {
    this.setState({
      pageX: e.pageX,
      pageY: e.pageY,
      visible: true
    })
  }

  menuClickHandler = ({ key }) => {
    const { onMenuClick } = this.props
    this.setState({ visible: false })
    onMenuClick(key)
  }

  renderPopup () {
    const { menus } = this.props
    const { pageX, pageY } = this.state
    const popupWrapperStyle = {
      top: `${pageY}px`,
      left: `${pageX}px`
    }
    const classes = classNames({
      'rc-contextmenu': true,
      [styles.popupWrapper]: true
    })

    return (
      <div className={classes} style={popupWrapperStyle}>
        <Menu theme="dark" onClick={this.menuClickHandler} style={{ width: 256 }} mode="vertical" menus={menus} />
      </div>
    )
  }

  render () {
    const { children, disabled } = this.props
    const { visible } = this.state
    return (
      <Trigger
        action={['contextMenu']}
        popupVisible={visible}
        popup={this.renderPopup()}
        popupAlign={{
          points: ['tl', 'bl'],
          offset: [0, 0]
        }}
        onPopupVisibleChange={disabled ? noop : v => this.setState({ visible: v })}
        destroyPopupOnHide
      >
        <span onContextMenu={disabled ? noop : this.contextMenuHandler}>
          {children}
        </span>
      </Trigger>
    )
  }
}

ContextMenu.propTypes = {
  menus: PropTypes.array.isRequired,
  onMenuClick: PropTypes.func,
  disabled: PropTypes.bool,
}

ContextMenu.defaultProps = {
  menus: [],  // [{ title, key, disabled, children } | 'divider']
  onMenuClick: () => {},
  disabled: false
}

export default ContextMenu
