import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Modal, message, Select } from 'antd'
import Page from '@/components/page/Page'
import PageToolbar from '@/components/page/PageToolbar'
import Toolbar from '@/lib/components/Toolbar'
import BaseLayerList from '@/components/layer/BaseLayerList'
import * as baselayerAPI from '@/apis/base-layers'
import { MAX_SELECTION_SIZE } from '@/constants'
import * as baseLayerCategoriesAPI from '@/apis/base-layer-categories'

const { SearchBox, CreateButton, Input } = PageToolbar
const { Tool } = Toolbar
const { confirm } = Modal
const { Option } = Select

class LayerAddPage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      searchString: '',
      selectedIds: [],
			categoryId: '',
			baseLayerCateList: [],
			baselayerList: {
				list: [],
				totalPage: 0,
				total: 0,
				page: 1,
				pageSize: 0,
			},
    }
  }

  componentDidMount () {
		this.fetchLayerCateList()
    this.fetchBaseLayerList()
  }

  fetchLayerCateList () {
		baseLayerCategoriesAPI.simpleList()
		.then(r => this.setState({ 
			baseLayerCateList: [{ id: -1, name: '所有图层类型' }, ...r] 
		}))
  }

  fetchBaseLayerList (pagination = { page: 1, pageSize: 10 }) {
    const condition = this.state
		const { layerData } = this.props
		const request = {
			name: condition.searchString,
			categoryId: condition.categoryId,
			projectId: layerData.projectId,
			deptId: layerData.deptId
		}
		baselayerAPI.list( request, pagination )
		.then( r => {
			this.setState({
				baselayerList:{
					list: r.list,
					totalPage: r.meta.totalPage,
					total: r.meta.total,
					page: r.meta.page,
					pageSize: r.meta.pageSize
				}
			})
		})
  }

  refresh (pagination) {
    this.fetchBaseLayerList(pagination || { page: this.state.baselayerList.currentPage })
  }

  paginationChangeHandler = (page, pageSize) => {
    this.fetchBaseLayerList({ page, pageSize })
  }

  searchStringChangeHandler = e => {
    this.setState({
      searchString: e.target.value
    })
  }

	categoryChangeHandler = id => {
		this.setState({
      categoryId: id === -1 ? '' : id
    }, () => this.refresh({ page: 1, pageSize: 10 }))
	}

  searchHandler = () => {
    this.refresh({ page: 1, pageSize: 10})
  }

  baselayerSelectionChangeHandler = (selectedRowKeys,selectData) => {
    if (selectedRowKeys.length > MAX_SELECTION_SIZE) {
      message.error(`最多选择${MAX_SELECTION_SIZE}个图层`)
      return
    }
    this.setState({ selectedIds: selectedRowKeys })
    const { onChecked } = this.props
    onChecked && onChecked(selectedRowKeys,selectData)
  }

  render () {
    const { list, currentPage, total, pageSize } = this.state.baselayerList
    const { selectedIds, baseLayerCateList } = this.state
    const leftTools = [
      <SearchBox key={0} onClick={this.searchHandler}>
				<Select style={{ width: 150 }} onChange={this.categoryChangeHandler} defaultValue={-1}>
					{baseLayerCateList.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
				</Select>
        <Input placeholder="请输入名称" onChange={this.searchStringChangeHandler} onPressEnter={this.searchHandler} />
      </SearchBox>
    ]

		const rowSelection = {
      onChange: this.baselayerSelectionChangeHandler,
      selectedRowKeys: selectedIds
    }

    return (
      <div>
			  <PageToolbar leftTools={leftTools} rightTools={[]} />
        <BaseLayerList
          listData={list}
          enabledActions = {['preview']}
          pagination={{
            current: currentPage,
            total,
            pageSize,
            onChange: this.paginationChangeHandler
          }}
          rowSelection={rowSelection}
        />
      </div>
    )
  }
}

export default LayerAddPage
