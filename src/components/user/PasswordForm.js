import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const FormItem = Form.Item

class PasswordForm extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps (nextProps) {
  }

  checkPass(rule, value, callback) {
    const { validateFields } = this.props.form;
    if (value) {
      validateFields(['passwordCheck']);
    }
    callback();
  }

  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  }

  render () {
    const { form } = this.props
    const { getFieldDecorator } = form

    return (
      <Form layout="vertical">
        <FormItem label="密码">
        {getFieldDecorator('password', {
          rules: [
            { required: true, whitespace: true, message: '请填写密码' },
            { validator: this.checkPass.bind(this) },
          ]
        })(
          <Input placeholder="请输入密码" type="password" autoComplete="off"/>
        )}
        </FormItem>
        <FormItem label="确认密码">
        {getFieldDecorator('passwordCheck', {
          rules: [
            { required: true, message: '请再次输入密码' },
            { validator: this.checkPass2.bind(this) }
          ]
        })(
          <Input placeholder="请输入确认密码" type="password" autoComplete="off"/>
        )}
        </FormItem>
      </Form>

    )
  }
}

PasswordForm.propTypes = {
}

PasswordForm.defaultProps = {
}

export default Form.create()(PasswordForm)
