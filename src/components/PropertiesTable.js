import React, { Component } from 'react'
import { Table } from 'antd'
import { omit, pick, isArray } from 'lodash'

/**
 * props.properties   [] | {}
 * props.omit
 * props.pick
 * props.labelMapping { [key]: [label] }
 * props.pickWithLabelMapping   default as true
 * antd.Table props
 */
export default class PropertiesTable extends Component {

  render () {
    const {
      properties = [],
      omit,
      pick,
      labelMapping,
      pickWithLabelMapping = true,
      size = 'small',
      pagination = false,
      bordered = true,
      ...restProps
    } = this.props
    const columns = [
      { title: '属性名', dataIndex: 'name', width: '30%'},
      { title: '属性值', dataIndex: 'value'}
    ]

    return (
      <Table
        rowKey={r => r.name}
        columns={columns}
        dataSource={transformProperties(properties, pick, omit, labelMapping, pickWithLabelMapping)}
        pagination={pagination}
        size={size}
        bordered={bordered}
        {...restProps}
      />
    )
  }
}

const transformProperties = (properties, picks = [], omits = [], labelMapping = {}, pickWithLabelMapping) => {
  // merge picks with labelMapping
  if (pickWithLabelMapping) {
    picks = [
      ...picks,
      ...Object.keys(labelMapping)
    ]
  }

  if (isArray(properties)) {
    return properties.filter(p => picks.includes(p.name)).filter(p => !omits.includes(p.name))
  } else { // object
    // picks = [] would pick nothing
    const keys = Object.keys(properties)
    if (!picks || picks.length === 0) {
      picks = keys
    }

    return Object.keys(
      omit(pick(properties, picks), omits)
    ).map(key => ({
      name: labelMapping[key] ? labelMapping[key] : key,
      value: properties[key]
    }))
  }
}

/**
 * props.propertiesGroup
 * props.titleFieldName
 * ...PropertiesTable.props
 */
export const PropertiesTableGroup = props => {
  const { propertiesGroup = [], title, ...rest } = props
  return (
    <div>
    {propertiesGroup.map((properties, index) => (
      <div style={{marginBottom:20}} key={index}>
        <PropertiesTable
          properties={properties}
          title={() => title(properties)}
          {...rest}
        />
      </div>
    ))}
    </div>
  )
}


/**
 * A quick PropertiesTable for form entities
 *
 * props.entity
 * props.schema           form schema of the entity
 * props.idToNameMapping
 */
export class PropertiesTableForEntity extends Component {

  _labelMapping () {
    const { schema, idToNameMapping = {} } = this.props
    const labelMapping = {}

    Object.keys(schema).forEach(p => {
      if (p in idToNameMapping) {
        labelMapping[idToNameMapping[p]] = schema[p].text
      } else {
        labelMapping[p] = schema[p].text
      }
    })

    return labelMapping
  }

  _transform () {
    const { schema, entity } = this.props
    const r = Object.assign({}, entity)
    /* Object.keys(r).forEach(key => {
      const field = schema[key]
      if (field && field.cvt && CVT[field.cvt]) {
        r[key] = getCVTLabel(CVT[field.cvt], entity[key])
      }
    }) */
    return r
  }

  render () {
    const { entity, schema, idToNameMapping, ...rest } = this.props
    return (
      <PropertiesTable properties={this._transform()} labelMapping={this._labelMapping()} {...rest} />
    )
  }
}
