import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu as AntMenu } from 'antd'

const { SubMenu, ItemGroup, Divider, Item } = AntMenu

const Menu = ({ menus, permissions, ...restProps }) => {
  let uid = 0

  const renderMenuItem = menuItem => {
    if (menuItem === 'divider') { // divider
      return <Divider key={uid++} />
    } else if (!menuItem.children || menuItem.children.length === 0) {  // menu item
      const { children, title, permission, ...rest } = menuItem
      if (!permission) return null
     
      let perm = permissions.includes(permission)
      if (permissions.includes('*')) {
        perm = true
      }

      return perm && <Item {...rest}>{title}</Item>

    } else if (menuItem.key && menuItem.children.length > 0) { // sub menu
      const { children, permissions: itemPermissions, ...rest } = menuItem
      if (!itemPermissions) return null
      let perm = itemPermissions.filter(ip => permissions.includes(ip))
      if (permissions.includes('*')) {
        perm.length = 1
      }

      return (
        perm.length && <SubMenu {...rest}>
          {children.map(menu => renderMenuItem(menu))}
        </SubMenu>
      )

    } else if (!menuItem.key && menuItem.children.length > 0) { // item group
      
      const { children, disabled, key, ...rest } = menuItem
      return (
        <ItemGroup {...rest}>
          {children.map(menu => renderMenuItem(menu))}
        </ItemGroup>
      )

    }
  }
  return (
    <AntMenu {...restProps}>
      {menus.map(menu => renderMenuItem(menu))}
    </AntMenu>
  )
}

Menu.propTypes = {
  menus: PropTypes.array.isRequired,
  permissions: PropTypes.array.isRequired,
  // other Antd.Menu propTypes
}

Menu.defaultProps = {
  menus: [],  // [{ title, key, disabled, children } | 'divider']
  permissions: [],
}

export default Menu
