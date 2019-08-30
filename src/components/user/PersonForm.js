import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col, Radio } from 'antd'

const FormItem = Form.Item

class PersonForm extends Component {
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

  render () {
    const { form } = this.props
    const { userData } = this.state
    const { getFieldDecorator } = form

    const formItemLayout = {
    };

    return (
      <Form>
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="邮箱" {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: userData.email
            })(
              <Input placeholder="无" readOnly/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="手机号" {...formItemLayout}>
            {getFieldDecorator('telephone', {
              initialValue: userData.telephone
            })(
              <Input placeholder="无" readOnly/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="登录名" {...formItemLayout}>
            {getFieldDecorator('username', {
              initialValue: userData.username
            })(
              <Input placeholder="无" readOnly/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="注册时间" {...formItemLayout}>
            {getFieldDecorator('createdAt', {
              initialValue: userData.createdAt
            })(
              <Input placeholder="无" readOnly/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="上次登陆时间" {...formItemLayout}>
            {getFieldDecorator('lastLoginAt', {
              initialValue: userData.lastLoginAt
            })(
              <Input placeholder="无" readOnly/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="上次登陆IP" {...formItemLayout}>
            {getFieldDecorator('lastLoginIp', {
              initialValue: userData.lastLoginIp
            })(
              <Input placeholder="无" readOnly/>
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>

    )
  }
}

PersonForm.propTypes = {
  userData: PropTypes.object.isRequired,
}

PersonForm.defaultProps = {
  userData: {}
}

export default Form.create()(PersonForm)
