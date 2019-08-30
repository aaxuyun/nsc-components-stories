import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col, InputNumber } from 'antd'

const FormItem = Form.Item

class BaseLayerCategoriesForm extends Component {

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
    const { formData } = this.state
    const { getFieldDecorator } = this.props.form

    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="图层分类名称">
            {getFieldDecorator('name', {
              initialValue: formData.name
            })(
              <Input placeholder="请输入图层分类名称" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="排序号">
            {getFieldDecorator('sortNo', {
              initialValue: formData.sortNo
            })(
              <InputNumber placeholder="请输入排序号" style={{width:'100%'}} />
            )}
            </FormItem>
          </Col>
          
        </Row>
      </Form>
    )
  }
}

BaseLayerCategoriesForm.propTypes = {

}

BaseLayerCategoriesForm.defaultProps = {

}

export default Form.create()(BaseLayerCategoriesForm)
