import { Component } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'

const Option = Select.Option

class LabelSelect extends Component {

  onChange = (value) => {
    const { onChange } = this.props
    onChange && onChange(value)
  }

  render () {
    let { label, width } = this.props
    label = label.slice()
    label.unshift({
      key: '-1',
      name: '所有处置',
    })
    return (
      <Select defaultValue={'-1'} onChange={this.onChange} style={{width}}>
        {label.map(l => <Option key={l.key}>{l.name}</Option>) }
      </Select>
    )
  }
}

LabelSelect.propTypes = {
  label: PropTypes.array.isRequired
}

LabelSelect.defaultProps = {
  label: [],
  width: '200px',
}

export default LabelSelect