import React, { Component } from 'react'
import { Form, Input, Row, Col, Icon } from 'antd'

const FormItem = Form.Item

class CodeVerifyForm extends Component {

  render () {
    const { form } = this.props
    const { getFieldDecorator } = form

    return (
      <Form>
        <Row gutter={40}>
          <Col span={24}>
            <FormItem>
            {getFieldDecorator('code', {
              rules: [{ required: true, len: 4, message: '验证码为4位数字' }]
            })(
              <Input size="large" prefix={<Icon type="exclamation-circle-o" />} placeholder="请输入验证码" />
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(CodeVerifyForm)
