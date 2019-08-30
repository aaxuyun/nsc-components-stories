import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col, Switch, Tooltip, Icon } from 'antd'
import LineSectionSelector from '@/components/line/LineSectionSelector'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

class ProtocolObjectForm extends Component {

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
		const { objData, protocolValid, lines, sections } = this.props
    return (
      <Form layout="vertical">
				<div style={{ marginBottom: 10 }}>
					{protocolValid && <Tooltip title={protocolValid}><span style={{color: 'red'}}><Icon type="exclamation-circle" />有效性说明</span></Tooltip>}
				</div>
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="标段">
            {getFieldDecorator('sectionId', {
              rules: [{ required: true, message: '线路标段不能为空' }],
              initialValue: objData ? `${objData.lineId},${objData.sectionId}` : null
            })(
              <LineSectionSelector lines={lines} sections={sections}/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="协议标题">
            {getFieldDecorator('name', {
              initialValue: objData ? objData.name : null
            })(
              <Input />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="协议类型">
            {getFieldDecorator('type', {
              initialValue: objData ? objData.type : null
            })(
							<Select placeholder="请选择协议类型">
								{Object.values(window.CVT.PROTOCOL_TYPE).map(type => <Option key={type.key} value={type.key}>{type.value}</Option>)}
              </Select>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="协议级别">
            {getFieldDecorator('level', {
              initialValue: objData ? objData.level : null
            })(
              <Select placeholder="请选择协议级别">
                {Object.values(window.CVT.PROTOCOL_LEVEL).map(type => <Option key={type.key} value={type.key}>{type.value}</Option>)}
              </Select>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="是否有效">
            {getFieldDecorator('isValidity', {
							valuePropName: 'checked',
              initialValue: objData.isValidity === 1 ? true : false
            })(
							<Switch />,
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="其它要求">
            {getFieldDecorator('other', {
              initialValue: objData ? objData.other : null
            })(
              <Input />
            )}
            </FormItem>
          </Col>
					<Col span={24}>
            <FormItem label="特殊要求">
            {getFieldDecorator('demand', {
              initialValue: objData && objData.demand ? objData.demand : null
            })(
              <TextArea placeholder="请输入特殊要求" />
            )}
            </FormItem>
          </Col>
					<Col span={24}>
            <FormItem label="落实情况">
            {getFieldDecorator('condition', {
              initialValue: objData && objData.condition ? objData.condition : null
            })(
              <TextArea placeholder="请输入落实情况" />
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

ProtocolObjectForm.propTypes = {

}

ProtocolObjectForm.defaultProps = {

}

export default Form.create()(ProtocolObjectForm)
