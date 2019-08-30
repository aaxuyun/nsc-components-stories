import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Col, InputNumber as AntInputNumber } from 'antd'
import LineSelectorAutoFetch from '@/components/line/LineSelectorAutoFetch'

const FormItem = Form.Item
class InputNumber extends Component {
  render () {
    return <AntInputNumber style={{width:'100%'}} {...this.props} />
  }
}

class SectionForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sectionData: props.sectionData || {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('sectionData' in nextProps) {
      this.setState({ sectionData: nextProps.sectionData })
    }
  }

  render () {
    const { sectionData } = this.state
    const { projectId } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="所属线路" required>
            {getFieldDecorator('lineId', {
              rules: [{ required: true, message: '所属线路不能为空' }],
              initialValue: sectionData.lineId
            })(
              <LineSelectorAutoFetch projectId={projectId} placeholder="请选择线路"/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="标段名称" required>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '标段名称不能为空' }],
              initialValue: sectionData.name
            })(
              <Input placeholder="请输入标段名称" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="标段编号" required>
            {getFieldDecorator('code', {
              rules: [{ required: true, message: '标段编号不能为空' }],
              initialValue: sectionData.code
            })(
              <Input placeholder="请输入标段编号" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="标段长度">
            {getFieldDecorator('length', {
              rules: [{ type: 'number', message: '请输入数字类型' }],
              initialValue: sectionData.length
            })(
              <InputNumber placeholder="请输入标段长度"/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="备注">
            {getFieldDecorator('comment', {
              initialValue: sectionData.comment
            })(
              <Input placeholder="请输入备注" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="排序号">
            {getFieldDecorator('sortNo', {
              rules: [{ type: 'number', message: '请输入数字类型' }],
              initialValue: sectionData.sortNo
            })(
              <InputNumber placeholder="请输入排序号" min={1}/>
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

SectionForm.propTypes = {
  projectId: PropTypes.string.isRequired,
}

SectionForm.defaultProps = {

}

export default Form.create()(SectionForm)
