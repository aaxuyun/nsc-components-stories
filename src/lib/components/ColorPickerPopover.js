import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'
import { Popover, Button } from 'antd'

class ColorPicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      color: props.value || {},
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value && nextProps.value !== this.props.value) {
      this.setState({ color: nextProps.value })
    }
  }

  handleChange = (color) => {
    this.setState({ color: color.rgb })
    const { onChange } = this.props
    onChange && onChange(color.rgb)
  };

  render() {
    const { disabled } = this.props
    const { color } = this.state
    const colorStr = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    const content = (
      <SketchPicker color={ color } onChange={ this.handleChange } />
    )

    return (
      <Popover content={content} trigger="click">
        <Button style={{width: '100%', borderRadius: 4, background: colorStr}} disabled={disabled}/>
      </Popover>
    )
  }
}

ColorPicker.propTypes = {
  onChange: PropTypes.func
}

ColorPicker.defaultProps = {
}

export default ColorPicker
