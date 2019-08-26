import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown as AntDropdown, Menu, Button, Icon } from 'antd'

const noop = () => {}

const Dropdown = props => {
  let n = 0
  const { label, menus, mode, onMenuClick, children, ...restProps } = props
  const renderMenuItem = item => {
    if (item === 'divider') {
      return <Menu.Divider key={n++} />
    } else if (item.children && item.children.length > 0) {
      return (
        <Menu.SubMenu title={item.label} key={item.key} disabled={!!item.disabled}>
          {item.children.map(subItem => renderMenuItem(subItem))}
        </Menu.SubMenu>
      )
    } else {
      return <Menu.Item key={item.key} disabled={!!item.disabled}>{item.label}</Menu.Item>
    }
  }
  const menu = (
    <Menu onClick={e => onMenuClick(e.key, e)}>
      {menus.map(item => renderMenuItem(item))}
    </Menu>
  )

  return (
    <AntDropdown overlay={menu}>
      {
        children
        ? children
        : mode === 'button' ? <Button {...restProps}>{label} <Icon type="down" /></Button> : <a {...restProps}>{label} <Icon type="down" /></a>
      }
    </AntDropdown>
  )
}

Dropdown.propTypes = {
  label: PropTypes.node.isRequired,
  menus: PropTypes.array.isRequired,
  mode: PropTypes.oneOf(['button', 'link']),
  onMenuClick: PropTypes.func
}

Dropdown.defaultProps = {
  onMenuClick: noop,
  menus: [],
  type: 'link'
}

export default Dropdown
