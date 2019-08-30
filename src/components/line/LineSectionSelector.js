import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option, OptGroup } = Select

const sorter = (a, b) => a.sortNo - b.sortNo
const optionValue = section => `${section.line.id},${section.id}`
export const parseOptionValue = (value = '') => {
  const [lineId, sectionId] = value.split(',')
  return { lineId, sectionId }
}

class LineSectionSelector extends Component {
  renderGroup () {
    const { lines, sections, showAll, ...props } = this.props
    return (
      <Select
        showSearch
        style={{ width: '100%', minWidth: '240px' }}
        placeholder="请选择标段"
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        {...props}
      >
        {showAll ? <Option value="-1" key="-1">全部标段</Option> : null}
        {lines.sort(sorter).map(line => {
          return (
            <OptGroup key={line.id} label={line.name}>
              {sections.filter(s => s.lineId === line.id).sort(sorter).map(section => {
                return (
                  <Option value={optionValue(section)} key={section.id}>{section.name}</Option>
                )
              })}
            </OptGroup>
          )
        })}
      </Select>
    )
  }

  renderFlat () {
    const { lines, sections, showAll, ...props } = this.props
    const items = sections.map(section => {
      const line = lines.find(l => section.lineId === l.id)
      return {
        key: `${line.id},${section.id}`,
        name: `[${section.name}]${line.name}`,
        sortNo: line.sortNo * 9999 + section.sortNo
      }
    })
    return (
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="请选择标段"
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        {...props}
      >
        {showAll ? <Option value="-1" key="-1">全部标段</Option> : null}
        {items.sort(sorter).map(item => <Option value={item.key} key={item.key}>{item.name}</Option>)}
      </Select>
    )
  }

  render () {
    const { grouped } = this.props
    return grouped ? this.renderGroup() : this.renderFlat()
  }
}

LineSectionSelector.propTypes = {
  lines: PropTypes.array.isRequired,
  sections: PropTypes.array.isRequired
}

LineSectionSelector.defaultProps = {
  lines: [],
  sections: [],
  showAll: false,
  grouped: true
}

export default LineSectionSelector