import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Icon, Row, Col, Input as AntInput, Select as AntSelect } from 'antd'
import Toolbar from '../../lib/components/Toolbar'

const { Tool, Group } = Toolbar

const Input = ({ style, ...restProps}) => {
  return (
    <Tool>
      <AntInput style={{ ...style, width: 180 }} {...restProps} />
    </Tool>
  )
}

const Select = ({ style, children, ...restProps }) => {
  return (
    <Tool>
      <AntSelect style={{ ...style, width: 180 }} showSearch optionFilterProp="children" {...restProps} >
        {children}
      </AntSelect>
    </Tool>
  )
}

const SearchBox = ({ placeholder, icon, onClick, onPressEnter, onChange, children }) => {
  return (
    <Group>
      {
        children
        ? (children.length ? children : [children]).map((c, i) => <Tool key={i}>{c}</Tool>)
        : <Tool><Input placeholder={placeholder} style={{width:240}} onPressEnter={onPressEnter} onChange={onChange} /></Tool>
      }
      <Tool><Button icon={icon} type="primary" onClick={onClick} /></Tool>
    </Group>
  )
}

SearchBox.propTypes = {
  placeholder: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onPressEnter: PropTypes.func
}

SearchBox.defaultProps = {
  placeholder: '输入搜索关键词',
  icon: 'search',
  onClick: () => {},
  onPressEnter: () => {}
}

const CreateButton = ({ text, icon, onClick, ...restProps }) => {
  return (
    <Tool>
      <Button type="primary" icon={icon} onClick={onClick} {...restProps}>{text}</Button>
    </Tool>
  )
}

CreateButton.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

CreateButton.defaultProps = {
  text: '新建',
  icon: 'plus',
  onClick: () => {}
}

class PageToolbar extends Component {
  render () {
    const { leftTools, rightTools } = this.props
    return (
      <Row type="flex" justify="space-between" style={{marginBottom:20}}>
        <Col>
          <Toolbar>
            {leftTools}
          </Toolbar>
        </Col>
        <Col>
          <Toolbar>
            {rightTools}
          </Toolbar>
        </Col>
      </Row>
    )
  }
}

PageToolbar.propTypes = {
  leftTools: PropTypes.arrayOf(PropTypes.node),
  rightTools: PropTypes.arrayOf(PropTypes.node)
}

PageToolbar.defaultProps = {
  leftTools: [],
  rightTools: []
}

PageToolbar.SearchBox = SearchBox
PageToolbar.CreateButton = CreateButton
PageToolbar.Select = Select
PageToolbar.Input = Input

export default PageToolbar
