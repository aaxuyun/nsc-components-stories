import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { message } from 'antd'
import { noop } from '@/utils/func'

const LEVEL_MAPPING = {
  PROVINCE: 'province',
  CITY: 'city',
  COUNTY: 'county',
  TOTAL: 'total'
}

class ProtocolStatisticsLevelList extends Component{

  clickHandler = (record, level) => {
		const { province, onItemClicked } = this.props
    if (level === 'TOTAL') {
      level = ''
    }
    onItemClicked && onItemClicked({
      province,
      deptId: record.id,
      level: level,
    })
  }

  renderCount = (record, level, value) => {
    const key = LEVEL_MAPPING[level]
    const countKey = key + 'Count'
    const extCountKey = key + 'GainCount'
    const count = record[countKey]
    const extCount = record[extCountKey]
    const percent = count === 0 ? 0 : (extCount/count*100)
    const label = value || `${extCount}/${count} - ${percent.toFixed(1)}%`
    if (record.id === 'total') {
      return label
    } else {
      return <span style={{cursor: 'pointer'}} onClick={() => this.clickHandler(record, level)}>{label}</span>
    }
  }

  render () {
    const {
      listData = [],
      pagination,
      onItemClicked,
			displayColumns,
      ...restProps
    } = this.props
    const columns = [
      { key: 'name', title: '设计院', align: 'center', dataIndex: 'name', width: 200, render: (v, r, i) => {
        return this.renderCount(r, '', v)
      } },
      { key: 'provinceData', title: <span>省级协议<br/>（已取得/拟取得）</span>, align: 'center', dataIndex: '', render: (v, r, i) => {
        return this.renderCount(r, 'PROVINCE')
      } },
      { key: 'cityData', title: <span>市级协议<br/>（已取得/拟取得）</span>, align: 'center', dataIndex: '', render: (v, r, i) => {
        return this.renderCount(r, 'CITY')
      } },
      { key: 'countyData', title: <span>县级协议<br/>（已取得/拟取得）</span>, align: 'center', dataIndex: '', render: (v, r, i) => {
        return this.renderCount(r, 'COUNTY')
      } },
      { key: 'totalData', title: <span>总计<br/>（已取得/拟取得）</span>, align: 'center', dataIndex: '', render: (v, r, i) => {
        return this.renderCount(r, 'TOTAL')
      } }
    ].filter(c => {
      if (displayColumns[0] === '*') {
        return true
      } else {
        return displayColumns.includes(c.key)
      }
    })
    return (
      <Table
        rowKey={r => r.id}
        columns={columns}
        dataSource={listData}
        pagination={pagination}
        {...restProps}
      />
    )
  }
}

ProtocolStatisticsLevelList.propTypes = {
  listData: PropTypes.array.isRequired,
  province: PropTypes.string,
  onItemClicked: PropTypes.func,
	displayColumns: PropTypes.array,
}

ProtocolStatisticsLevelList.defaultProps = {
  listData: [],
	displayColumns: ['*']
}
export default ProtocolStatisticsLevelList
