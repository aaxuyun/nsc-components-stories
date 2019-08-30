import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col, Upload, message, Button, Icon, Checkbox, Tooltip  } from 'antd'
import SupervisorTypeSelectorAutoFetch from '@/components/supervisor/SupervisorTypeSelectorAutoFetch'
import ManagerDepartmentTreeSelectorAutoFetch from '@/components/department/ManagerDepartmentTreeSelectorAutoFetch'
import UserSelectorAutoFetch from '@/components/user/UserSelectorAutoFetch'
import SupervisorSectionSelectorAutoFetch from '@/components/section/SupervisorSectionSelectorAutoFetch'

const { Option } = Select
const FormItem = Form.Item
const TextArea = Input.TextArea

class SupervisorForm extends Component {

  constructor (props) {
    super(props)
    this.state = {
      supervisorData: props.supervisorData || {},
      selectedDepartment: [],
      sectionId: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('supervisorData' in nextProps) {
      this.setState({ supervisorData: nextProps.supervisorData })
    }
  }
	
	sendMsg = (e) => {
		const { setFieldsValue } = this.props.form
		if (e.target.checked) {
			setFieldsValue({ sendMsg: 1 })
		} else {
			setFieldsValue({ sendMsg: 0 })
		}
	}

  onSelectChange = (value) => {
    this.setState({selectedDepartment: value})
  }

  onSectionChange = (sectionId) => {
    const sectionIds = sectionId.split(',')
    const { setFieldsValue } = this.props.form
    setFieldsValue({ rDeptIds: [] })

    const {onSectionChange, projectId} = this.props
    this.setState({sectionId}, () => {
      onSectionChange && onSectionChange(projectId, sectionIds[1])
    })
  }

  render () {
    const { supervisorData, selectedDepartment, sectionId } = this.state
    const { getFieldDecorator } = this.props.form
    const { userInfo, departments, userDepartment, projectId, lines } = this.props
    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="">
            {getFieldDecorator('sendMsg', {
              valuePropName: 'checked'
            })(
              <Tooltip title="勾选后，发送部门会给接收部门发送短信提示">
                <Checkbox onChange={this.sendMsg}>发送提示短信</Checkbox>
              </Tooltip>
            )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="标段">
              {getFieldDecorator('sectionId', {
                rules: [{ required: true, message: '标段不能为空' }],
                initialValue: supervisorData.sectionId
            })(
              <SupervisorSectionSelectorAutoFetch projectId={projectId} onChange={this.onSectionChange} lines={lines}/>
            )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="发送人">
            {getFieldDecorator('sUser', {
              initialValue: userInfo.username
            })(
              <Input disabled/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="发送部门">
            {getFieldDecorator('sDeptId', {
              initialValue: userDepartment.name
            })(
              <Input disabled/>
            )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="接收部门">
            {getFieldDecorator('rDeptIds', {
              initialValue: supervisorData.rDeptIds && supervisorData.rDeptIds.split(',')
            })(
              <ManagerDepartmentTreeSelectorAutoFetch departments={departments || []} sectionId={sectionId} onChange={this.onSelectChange}/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="接收人">
            {getFieldDecorator('rUserIds', {
              initialValue: supervisorData.rUserIds && supervisorData.rUserIds.split(',')
            })(
              <UserSelectorAutoFetch selectedDepartment={selectedDepartment} projectId={projectId} disabled={selectedDepartment.length > 0 ? false : true}/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="所属类型">
            {getFieldDecorator('combineType', {
              rules: [{ required: true, message: '所属类型不能为空' }],
              initialValue: supervisorData.combineType
            })(
                <SupervisorTypeSelectorAutoFetch placeholder="请选择类型"/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="标题">
            {getFieldDecorator('title', {
							rules: [{ required: true, message: '标题不能为空' }],
              initialValue: supervisorData.title
            })(
              <Input placeholder="请输入标题" />
            )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="备注">
            {getFieldDecorator('comment', {
              initialValue: supervisorData.comment
            })(
              <TextArea placeholder="请输入备注" />
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

SupervisorForm.propTypes = {

}

SupervisorForm.defaultProps = {

}

export default Form.create()(SupervisorForm)
