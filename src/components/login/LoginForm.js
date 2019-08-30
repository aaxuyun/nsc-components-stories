import React, { Component } from 'react'
import { Form, Input, Row, Col, Icon } from 'antd'

const FormItem = Form.Item

class LoginForm extends Component {

  render () {
    const { form } = this.props
    const { getFieldDecorator } = form

    return (
      <Form>
        <Row gutter={40}>
          <Col span={24}>
            <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '账号不能为空' }]
            })(
              <Input size="large" prefix={<Icon type="user" />} placeholder="请输入账号" />
            )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '密码不能为空' }]
            })(
              <Input size="large" type="password" prefix={<Icon type="lock" />} placeholder="请输入密码"/>
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(LoginForm)
