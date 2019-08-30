import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd'
import moment from 'moment'
import ProvinceSelectAutoFetch from '@/components/district/ProvinceSelectAutoFetch'

const FormItem = Form.Item

class ProtocolProgressForm extends Component {

  constructor (props) {
    super(props)
    this.state = {
			formData: props.formData || {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('formData' in nextProps) {
      this.setState({ formData: nextProps.formData })
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
		const { formData } = this.state
    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="线路段" >
            {getFieldDecorator('line', {
              initialValue: formData && formData.line
            })(
              <Input placeholder="请输入线路段" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="所在省份" >
            {getFieldDecorator('province', {
              initialValue: formData.province ? formData.province.split(',') : []
            })(
              <ProvinceSelectAutoFetch mode="multiple" placeholder="请选择省份"/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="可研协议总数" >
            {getFieldDecorator('allCount', {
              initialValue: formData && formData.allCount
            })(
              <InputNumber placeholder="请输入协议总数" style={{width:'100%'}} />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="已完成协议总数">
            {getFieldDecorator('comCount', {
              initialValue: formData && formData.comCount
            })(
              <InputNumber placeholder="请输入已完成协议总数" style={{width:'100%'}} />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="存在问题">
            {getFieldDecorator('question', {
              initialValue: formData && formData.question
            })(
              <Input placeholder="请输入存在问题" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="工作进展">
            {getFieldDecorator('progress', {
              initialValue: formData && formData.progress
            })(
              <Input placeholder="请输入工作进展" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="下一步工作安排">
            {getFieldDecorator('next', {
              initialValue: formData && formData.next
            })(
              <Input placeholder="请输入下一步工作安排" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="计划完成时间">
            {getFieldDecorator('comDate', {
              initialValue: formData.comDate ? moment(formData.comDate,'YYYY-MM-DD HH:mm:ss') : null
            })(
							<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }}/>
						)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="责任单位">
            {getFieldDecorator('resUnit', {
              initialValue: formData && formData.resUnit
            })(
              <Input placeholder="请输入责任单位" />
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

ProtocolProgressForm.propTypes = {

}

ProtocolProgressForm.defaultProps = {

}

export default Form.create()(ProtocolProgressForm)
