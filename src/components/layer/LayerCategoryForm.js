import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, InputNumber, Input } from 'antd'

const FormItem = Form.Item

class LayerCategoryForm extends Component {
  render () {
    const { form, layerCategoryData = {} } = this.props
    const { getFieldDecorator } = form

    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="分类名称" required>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '分类名称不能为空' }],
              initialValue: layerCategoryData.name
            })(
              <Input placeholder="请输入分类名称" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="排序号" required>
            {getFieldDecorator('sortNo', {
              rules: [{ required: true, message: '排序号不能为空' }],
              initialValue: layerCategoryData.sortNo
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

LayerCategoryForm.propTypes = {
  layerCategoryData: PropTypes.object
}

LayerCategoryForm.defaultProps = {

}

export default Form.create()(LayerCategoryForm)
