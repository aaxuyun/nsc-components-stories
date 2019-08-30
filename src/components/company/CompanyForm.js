import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col } from 'antd'

const FormItem = Form.Item

class CompanyForm extends Component {

  constructor (props) {
    super(props)
    this.state = {
      companyData: props.companyData || {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('companyData' in nextProps) {
      this.setState({ companyData: nextProps.companyData })
    }
  }

  render () {
    const { companyData } = this.state
    const { getFieldDecorator } = this.props.form

    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="单位名称" required>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '单位名称不能为空' }],
              initialValue: companyData.name
            })(
              <Input placeholder="请输入单位名称" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="单位简称" required>
            {getFieldDecorator('shortName', {
              rules: [{ required: true, message: '单位简称不能为空' }],
              initialValue: companyData.shortName
            })(
              <Input placeholder="请输入单位简称" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="单位编码" required>
            {getFieldDecorator('code', {
              rules: [{ required: true, message: '单位编码不能为空' }],
              initialValue: companyData.code
            })(
              <Input placeholder="请输入单位编码" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="单位类型" required>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '单位类型不能为空' }],
              initialValue: companyData.type
            })(
              <Select>
                <Select.Option key="1">1</Select.Option>
              </Select>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="联系地址">
            {getFieldDecorator('address', {
              initialValue: companyData.address
            })(
              <Input placeholder="请输入联系地址" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="邮政编码">
            {getFieldDecorator('postcode', {
              initialValue: companyData.postcode
            })(
              <Input placeholder="请输入邮政编码" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="负责人">
            {getFieldDecorator('managerName', {
              initialValue: companyData.managerName
            })(
              <Input placeholder="请输入负责人" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="电话">
            {getFieldDecorator('tel', {
              initialValue: companyData.tel
            })(
              <Input placeholder="请输入电话" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="邮箱">
            {getFieldDecorator('email', {
              initialValue: companyData.email
            })(
              <Input placeholder="请输入邮箱" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="机构代码">
            {getFieldDecorator('orgzCode', {
              initialValue: companyData.orgzCode
            })(
              <Input placeholder="请输入组织机构代码（社会信用证号）" />
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

CompanyForm.propTypes = {

}

CompanyForm.defaultProps = {

}

export default Form.create()(CompanyForm)
