import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, InputNumber, Input, Select, Radio, message } from 'antd'
import BaseLayerCateSelectAutoFetch from '@/components/layer/BaseLayerCateSelectAutoFetch'
import BaseMapServiceAuthSelectorAutoFetch from '@/components/layer/BaseMapServiceAuthSelectorAutoFetch'
import { getMapServiceJSONDetails, getMapServiceLayerType } from '@/lib/geometry/utils'
import { isMapServicePrivate, isPBSMapService, isValidToken } from '@/lib/components/arcmap/utils'
import * as baseMapServiceAuthsAPI from '@/apis/base-map-service-auths'
import queryString from 'query-string'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { Option } = Select

class BaseLayerForm extends Component {

	constructor (props) {
		super(props)
		this.state = {
			formData: props.formData || {},
			isPrivateMapService: false
		}
	}

  componentWillReceiveProps (nextProps) {
    if ('formData' in nextProps) {
      this.setState({ formData: nextProps.formData })
    }
	}

	componentDidMount () {
		const { formData } = this.props
		if (formData && formData.mapServerUrl) {
			isMapServicePrivate(formData.mapServerUrl).then(isPrivate => {
				this.setState({ isPrivateMapService: isPrivate })
			})
		}
	}
	
	setMapLayerType (mapServerUrl) {
		const { setFieldsValue } = this.props.form

		if (isPBSMapService(mapServerUrl)) { // PBS published map service can only be tiled type
			setFieldsValue({ type: 'tiled' })
		} else {
			getMapServiceJSONDetails(mapServerUrl).then(json => {
				const type = getMapServiceLayerType(json)
				const match = Object.values(window.CVT.MAP_LAYER_TYPE).find(t => t.value === type)
				setFieldsValue({ type: match.value })
			}).catch(e => {
				console.error('getMapLayerType error', e)
				setFieldsValue({ type: undefined })
			})
		}
	}

	mapServerUrlInputBlurHandler = () => {
    const { form } = this.props
		const url = form.getFieldValue('mapServerUrl')
		
		const _clear = () => {
			this.setState({ isPrivateMapService: false })
			form.setFieldsValue({
				type: undefined,
				authId: undefined
			})
		}

		if (url) {
			// PBS map service can't be set as private, and isMapServicePrivate will always return false
			isMapServicePrivate(url).then(isPrivate => {
				this.setState({ isPrivateMapService: isPrivate })
	
				if (!isPrivate) {
					form.setFieldsValue({ authId: null })
					this.setMapLayerType(url)
				}
			})
		} else {
			_clear()
		}
	}
	
	mapServiceAuthChangeHandler = (authId) => {
		const { getFieldValue, setFieldsValue } = this.props.form

		if (authId) {
			const mapServerUrl = getFieldValue('mapServerUrl')
			baseMapServiceAuthsAPI.getToken(authId).then(token => {
				if (!token) {
					// 选中授权信息 host + username + password 不能正确的 generateToken
					message.warn('授权信息无效')
					setFieldsValue({ type: undefined })
				} else {
					isValidToken(mapServerUrl, token).then(valid => {
						if (valid) {
							const { url, query } = queryString.parseUrl(mapServerUrl)
							query.token = token
							this.setMapLayerType(`${url}?${queryString.stringify(query)}`)
						} else {
							// token 能生成，但是不能授权当前的 mapService
							message.warn('选中授权信息未能正确授权地图服务')
							setFieldsValue({ type: undefined })
						}
					})
				}
			})
		}
	}

  render () {
		const { omitFields, form } = this.props
		const { formData, isPrivateMapService } = this.state
		const { getFieldDecorator, getFieldValue } = form
		const mapServerUrl = getFieldValue('mapServerUrl')

    return (
		<Form layout="vertical">
			<Row gutter={40}>
				<Col span={12}>
					<FormItem label="图层名称" required>
					{getFieldDecorator('name', {
						rules: [{ required: true, message: '图层名称不能为空' }],
						initialValue: formData.name
					})(
						<Input placeholder="请输入图层名称" />
					)}
					</FormItem>
				</Col>
        <Col span={12}>
					<FormItem label="图层备注" >
					{getFieldDecorator('remark', {
						initialValue: formData.remark
					})(
						<Input placeholder="请输入图层备注" />
					)}
					</FormItem>
				</Col>
				<Col span={12}>
					<FormItem label="图层服务类型" required>
					{getFieldDecorator('type', {
						rules: [{ required: true, message: '图层服务类型不能为空' }],
						initialValue: formData.type
					})(
						<Select placeholder="自动识别图层服务类型" disabled>
							{Object.values(window.CVT.MAP_LAYER_TYPE).map(type => <Option key={type.value}>{type.value2}</Option>)}
						</Select>
					)}
					</FormItem>
				</Col>
			</Row>
			<Row gutter={40}>
				{!omitFields.includes('sortNo') ?
				<Col span={12}>
					<FormItem label="排序号" required>
					{getFieldDecorator('sortNo', {
						rules: [{ required: true, message: '排序号不能为空' }],
						initialValue: formData.sortNo
					})(
						<InputNumber placeholder="请输入排序号" style={{width:'100%'}} />
					)}
					</FormItem>
				</Col>
				: null}
				{!omitFields.includes('defaultDisplay') ?<Col span={12}>
					<FormItem label="默认显示状态">
					{getFieldDecorator('defaultDisplay', {
						initialValue: formData.defaultDisplay || 0
					})(
						<RadioGroup>
							<Radio value={0}>隐藏</Radio>
							<Radio value={1}>显示</Radio>
						</RadioGroup>
					)}
					</FormItem>
				</Col>
				: null}
			</Row>
			<Row gutter={40}>
				{!omitFields.includes('categoryId') ?
				<Col span={12}>
					<FormItem label="图层分类类型">
					{getFieldDecorator('categoryId', {
						initialValue: formData.categoryId
					})(
						<BaseLayerCateSelectAutoFetch placeholder="请选择图层分类类型"/>
					)}
					</FormItem>
				</Col>
				: null}
			</Row>
			<Row>
				<Col>
					<FormItem label={`地图服务地址${isPrivateMapService ? '(私有)' : ''}`}>
					{getFieldDecorator('mapServerUrl', {
						rules: [{ required: true, message: '地图服务地址不能为空' }],
						initialValue: formData.mapServerUrl
					})(
						<Input placeholder="请输入地图服务地址" onBlur={this.mapServerUrlInputBlurHandler} />
					)}
					</FormItem>
				</Col>
			</Row>
			<Row>
				<Col>
					<FormItem label="地图服务授权">
					{getFieldDecorator('authId', {
						rules: [{ required: isPrivateMapService, message: '地图服务授权不能为空' }],
						initialValue: formData.authId
					})(
						<BaseMapServiceAuthSelectorAutoFetch disabled={!isPrivateMapService} onChange={this.mapServiceAuthChangeHandler}  />
					)}
					</FormItem>
				</Col>
			</Row>
			<Row>
				<Col>
					<FormItem label="离线包地址">
					{getFieldDecorator('offlinePackageUrl', {
						initialValue: formData.offlinePackageUrl
					})(
						<Input placeholder="请输入离线包地址" />
					)}
					</FormItem>
				</Col>
			</Row>
			<Row gutter={40}>
				<Col span={12}>
					<FormItem label="离线包解压密码">
					{getFieldDecorator('packagePassword', {
						initialValue: formData.packagePassword
					})(
						<Input placeholder="请输入离线包解压密码" />
					)}
					</FormItem>
				</Col>
			</Row>
		</Form>

    )
  }
}

BaseLayerForm.propTypes = {
	omitFields: PropTypes.array,
}

BaseLayerForm.defaultProps = {
	omitFields: []
}

export default Form.create()(BaseLayerForm)
