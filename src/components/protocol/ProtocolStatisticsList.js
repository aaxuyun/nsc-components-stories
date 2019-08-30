import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const getProtocolClasses = (statisticBy) => {
  const protocolLevels = statisticBy === 'TYPE' ? window.CVT.PROTOCOL_TYPE : window.CVT.PROTOCOL_LEVEL
  return Object.keys(protocolLevels).map(key => ({
    key: protocolLevels[key].key,
    name: protocolLevels[key].value,
    dbKey: protocolLevels[key].value3
  }))
}

class ProtocolStatisticsList extends Component{

  clickHandler = (record, level) => {
		const { province, onItemClicked } = this.props
    if (level === 'total') {
      level = ''
    }
    onItemClicked && onItemClicked({
      province,
      deptId: record.id,
      level: level,
    })
  }

  renderCount (key, dbKey, record) {
    const { onClickItem } = this.props
    const { statistic = [] } = record
    const statisticItem = statistic.find(s => s.key === (dbKey || key)) // LEVEL use key, TYPE use dbKey
    if (!statisticItem || (statisticItem && statisticItem.total === 0)) { // 没有配置，或者配置了拟取得为 0
      return '/'
    } else {
      const percentStr = statisticItem ? (statisticItem.percent * 100).toFixed(0) : 0
      return <a onClick={_ => onClickItem(key, record)}>{percentStr}</a>
    }
  }

  render () {
    const {
      listData = [],
      pagination,
      onItemClicked,
      displayColumns,
      statisticBy,
      ...restProps
    } = this.props
    const protocolClasses = getProtocolClasses(statisticBy)

    const columns = [
      { key: 'voltageLevel', title: '电压等级（kV）', dataIndex: 'voltageLevel', render: (v, r, i) => {
        const value = r.line ? r.line.voltageLevel : ''
        return window.CVT.VOLTAGE_LEVEL[value].value
      } },
      { key: 'lineName', title: '工程名称', dataIndex: 'lineName', render: (v, r, i) => {
        return r.line ? r.line.name : ''
      } },
      { key: 'name', title: '设计包段', dataIndex: 'name' },
      { key: 'designer', title: '设计单位', dataIndex: 'designer', render: (v, r, i) => {
        const dept = r.departments.find(d => d.roleId === '0a128045-33ec-11e9-b84e-00163e2ef0cb')
        return dept ? dept.name : ''
      } },
      { key: 'manager', title: '管理单位', dataIndex: 'manager', render: (v, r, i) => {
        const dept = r.departments.find(d => d.roleId === '8ad574ad-4528-11e9-b84e-00163e2ef0cb')
        return dept ? dept.name : ''
      } },
      { key: 'sum', title: '总进度（%）', dataIndex: 'sum', render: (v, r, i) => {
        const keys = protocolClasses.map(item => item.dbKey)
        const { statistic = [] } = r
        let total = 0, count = 0
        keys.forEach(key => {
          const match = statistic.find(s => s.key === key)
          if (match) {
            total += match.total
            count += match.count
          }
        })
        return total ? ((count / total) * 100).toFixed(0) : '/'
      } },
      ...protocolClasses.map(item => {
        return (
          { key: item.key, title: `${item.name}（%）`, dataIndex: '', render: (v, r, i) => {
            return this.renderCount(item.key, item.dbKey, r)
          } }
        )
      })
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
        scroll={{ x: 2000 }}
        {...restProps}
      />
    )
  }
}

ProtocolStatisticsList.propTypes = {
  listData: PropTypes.array.isRequired,
  province: PropTypes.string,
  onItemClicked: PropTypes.func,
	displayColumns: PropTypes.array,
}

ProtocolStatisticsList.defaultProps = {
  listData: [],
	displayColumns: ['*']
}

export default ProtocolStatisticsList
