import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col, InputNumber } from 'antd'
import CompanySelectorAutoFetch from '@/components/company/CompanySelectorAutoFetch'
import DistrictSelectorAutoFetch from '@/components/district/DistrictSelectorAutoFetch'
import DepartmentRoleSelectorAutoFetch from '@/components/department/DepartmentRoleSelectorAutoFetch'

const FormItem = Form.Item

class DepartmentForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      departmentData: props.departmentData || {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('departmentData' in nextProps) {
      this.setState({ departmentData: nextProps.departmentData })
    }
  }

  render () {
    const { form, projectId } = this.props
    const { departmentData } = this.state
    const { getFieldDecorator } = form
    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="部门名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '部门名称不能为空' }],
              initialValue: departmentData.name
            })(
              <Input placeholder="请输入部门名称" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="所属单位">
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '所属单位不能为空' }],
              initialValue: departmentData.companyId
            })(
              <CompanySelectorAutoFetch placeholder="请选择所属单位" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="部门角色">
            {getFieldDecorator('roleId', {
              initialValue: departmentData.roleId,
              rules: [{ required: true, message: '部门角色不能为空' }],
            })(
              <DepartmentRoleSelectorAutoFetch projectId={projectId} />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="排序号">
            {getFieldDecorator('sortNo', {
              rules: [{ required: true, message: '排序号不能为空' }],
              initialValue: departmentData.sortNo
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

DepartmentForm.propTypes = {
  departmentData: PropTypes.object.isRequired
}

DepartmentForm.defaultProps = {
  departmentData: {}
}

export default Form.create()(DepartmentForm)
