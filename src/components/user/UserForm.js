import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col, Radio } from 'antd'
import CompanySelectorAutoFetch from '@/components/company/CompanySelectorAutoFetch'

const RadioGroup = Radio.Group
const FormItem = Form.Item

class UserForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userData: props.userData || {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('userData' in nextProps) {
      this.setState({ userData: nextProps.userData })
    }
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
    const { form, showPassword } = this.props
    const { userData } = this.state
    const { getFieldDecorator } = form

    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="登录名" required>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '登录名不能为空' }],
              initialValue: userData.username
            })(
              <Input placeholder="请输入登录名" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="手机号" required>
            {getFieldDecorator('telephone', {
              rules: [{ required: true, message: '手机号不能为空' }],
              initialValue: userData.telephone
            })(
              <Input placeholder="请输入手机号" />
            )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="用户姓名" required>
            {getFieldDecorator('name', {
              initialValue: userData.name
            })(
              <Input placeholder="请输入用户姓名" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="单位选择" required>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '单位不能为空' }],
              initialValue: userData.companyId
            })(
              <CompanySelectorAutoFetch placeholder="请选择单位"/>
            )}
            </FormItem>
          </Col>
        </Row>
        {showPassword &&
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="密码">
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请填写密码' },
                { validator: this.checkPass.bind(this) },
              ]
            })(
              <Input placeholder="请输入密码" type="password" autoComplete="off"/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>}
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="性别" required>
            {getFieldDecorator('gender', {
              rules: [{ required: true, message: '性别不能为空' }],
              initialValue: userData.gender
            })(
              <RadioGroup>
                <Radio value={0}>男性</Radio>
                <Radio value={1}>女性</Radio>
              </RadioGroup>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="用户角色" required>
            {getFieldDecorator('role', {
              rules: [{ required: true, message: '用户角色不能为空' }],
              initialValue: userData.role
            })(
              <RadioGroup>
                <Radio value={0}>管理员</Radio>
                <Radio value={1}>普通用户</Radio>
              </RadioGroup>
            )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="邮箱">
            {getFieldDecorator('email', {
              rules: [{ type: 'email', message: '请输入正确的邮箱' }],
              initialValue: userData.email
            })(
              <Input placeholder="请输入邮箱" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="备注">
            {getFieldDecorator('comment', {
              initialValue: userData.comment
            })(
              <Input placeholder="请输入备注" />
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>

    )
  }
}

UserForm.propTypes = {
  userData: PropTypes.object.isRequired,
  showPassword: PropTypes.bool
}

UserForm.defaultProps = {
  userData: {},
  showPassword: true
}

export default Form.create()(UserForm)
