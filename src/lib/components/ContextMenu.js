import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ContextMenu, Item, Separator, Submenu, ContextMenuProvider } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'

let uid = 0
const MENU_ID = 'CTX_ID'

class CtxMenu extends Component {
  renderMenuItem (item) {
    const { onMenuClick } = this.props
    if (item === 'divider') {
      return <Separator key={uid++}/>
    } else if (!item.children || item.children.length === 0) {
      return <Item key={item.key} onClick={() => onMenuClick(item.key)} disabled={!!item.disabled}>{item.title}</Item>
    } else if (item.children.length > 0) {
      return (
        <Submenu label={item.title} key={uid++}>
          {item.children.map(c => this.renderMenuItem(c))}
        </Submenu>
      )
    }
  }

  renderMenu () {
    const { menus } = this.props
    return (
      <ContextMenu id={MENU_ID}>
        {menus.map(menu => this.renderMenuItem(menu))}
      </ContextMenu>
    )
  }

  render () {
    const { children } = this.props
    return (
      <span>
        <ContextMenuProvider id={MENU_ID}>
          {children}
        </ContextMenuProvider>
        {this.renderMenu()}
      </span>
    )
  }
}

CtxMenu.propTypes = {
  menus: PropTypes.array.isRequired,
  onMenuClick: PropTypes.func
}

CtxMenu.defaultProps = {
  menus: [],  // [{ title, key, disabled, children } | 'divider']
  onMenuClick: () => {}
}

export default CtxMenu