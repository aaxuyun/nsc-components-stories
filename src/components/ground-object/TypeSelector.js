import { Component } from "react"
import PropTypes from 'prop-types'
import { Cascader } from 'antd'

class GobjCascader extends Component {
  render () {
    return (
      <Cascader {...this.props}/>
    )
  }
}

GobjCascader.propTypes = {
  options: PropTypes.array.isRequired, //tree data
  fieldNames: PropTypes.object,   //自定义 options 中 label name children 的字段
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.array,
  expandTrigger: PropTypes.string, //次级菜单的展开方式 'click | hover'
  onChange: PropTypes.func
}

GobjCascader.defaultProps = {
  fieldNames: { label: 'name', value: 'key', children: 'children' },
  placeholder: '请选择地物类型',
  // disabled: false,
  // expandTrigger: 'click', 
  // onChange: () => {}
}


class GobjTree extends Component {
  render () {
    return ''
  }
}


const TypeSelector = {
  GobjCascader, 
  GobjTree,
}

export default TypeSelector