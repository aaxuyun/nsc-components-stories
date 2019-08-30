import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const FormItem = Form.Item

class ResetPasswordForm extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps (nextProps) {
  }

  checkPass(rule, value, callback) {
    const { validateFields } = this.props.form;
    if (value) {
      validateFields(['newPasswordCheck']);
    }
    callback();
  }

  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('newPassword')) {
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
        <FormItem label="原始密码">
        {getFieldDecorator('originPassword', {
          rules: [
            { required: true, whitespace: true, message: '请输入原始密码' },
          ]
        })(
          <Input placeholder="请输入密码" type="password" autoComplete="off"/>
        )}
        </FormItem>
        <FormItem label="新密码">
        {getFieldDecorator('newPassword', {
          rules: [
            { required: true, whitespace: true, message: '请输入新密码' },
            { validator: this.checkPass.bind(this) },
          ]
        })(
          <Input placeholder="请输入密码" type="password" autoComplete="off"/>
        )}
        </FormItem>
        <FormItem label="确认新密码">
        {getFieldDecorator('newPasswordCheck', {
          rules: [
            { required: true, message: '请再次输入新密码' },
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

ResetPasswordForm.propTypes = {
}

ResetPasswordForm.defaultProps = {
}

export default Form.create()(ResetPasswordForm)
