import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table from '@/components/Table'

const rowKey = r => r.name

class LineTopoRatioForm extends Component{

  render () {
    const { topoInfo } = this.props
    const columns = [
      { key: 'name', title: '名称', dataIndex: 'name' },
      { key: 'percent', title: '占比(%)', dataIndex: 'percent', render: v => v === 0 ? v : (v*100).toFixed(2) },
      { key: 'length', title: '长度(km)', dataIndex: 'length', render: v => v === 0 ? v : v.toFixed(2) }
    ]

    return (
			<Table
				rowKey={rowKey}
				columns={columns}
				dataSource={topoInfo.landform}
        pagination={false}
			/>
    )
  }
}

LineTopoRatioForm.propTypes = {
  topoInfo: PropTypes.object  // { }
}

LineTopoRatioForm.defaultProps = {

}

export default LineTopoRatioForm
