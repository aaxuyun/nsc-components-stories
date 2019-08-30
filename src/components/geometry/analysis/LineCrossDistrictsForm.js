import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table from '@/components/Table'

const rowKey = r => r.name

class LineCrossDistrictsForm extends Component{
  state = {
    expandedRowKeys: []
  }

  expandHandler = (expanded, r) => {
    const { expandedRowKeys } = this.state
    const key = rowKey(r)
    this.setState({
      expandedRowKeys: expanded
        ? [...expandedRowKeys, key]
        : expandedRowKeys.filter(k => k !== key)
    })
  }

  render () {
    const { districts } = this.props
    const { expandedRowKeys } = this.state
    
		const columns = [
      { key: 'name', title: '名称', dataIndex: 'name' },
      { key: 'lengthPercent', title: '跨越占比(%)', dataIndex: 'lengthPercent', render: v => v === 0 ? v : (v*100).toFixed(2) },
      { key: 'intersectLength', title: '跨越长度(km)', dataIndex: 'intersectLength', render: v => v === 0 ? v : v.toFixed(2) }
    ]
    return (
			<Table
				rowKey={rowKey}
				columns={columns}
        dataSource={districts}
        expandedRowKeys={expandedRowKeys}
        onExpand={this.expandHandler}
        pagination={false}
			/>
    )
  }
}

LineCrossDistrictsForm.propTypes = {
  districts: PropTypes.array.isRequired
}

LineCrossDistrictsForm.defaultProps = {
  districts: []
}

export default LineCrossDistrictsForm