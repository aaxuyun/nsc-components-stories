import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col, InputNumber } from 'antd'
import _ from 'lodash'

const FormItem = Form.Item

class TreeConfigForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      treeNodeData: props.treeNodeData || {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('treeNodeData' in nextProps) {
      this.setState({ treeNodeData: { ...nextProps.treeNodeData } })
    }
  }

  render () {
    const { treeNodeData } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <Form layout="vertical">
        <Row gutter={40}>

          <Col span={12}>
            <FormItem label="节点名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '节点名称不能为空' }],
              initialValue: treeNodeData.name
            })(
              <Input placeholder="请输入杆塔名称" />
            )}
            </FormItem>
          </Col>
					<Col span={12}>
            <FormItem label="节点Key">
            {getFieldDecorator('key', {
							rules: [{ required: true, message: '节点Key不能为空' }],
              initialValue: treeNodeData.key
            })(
              <Input placeholder={`${treeNodeData.parentKey || ''}XXX`}/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="节点层级">
            {getFieldDecorator('level', {
							rules: [{ required: true, message: '节点层级不能为空' }],
              initialValue: treeNodeData.level
            })(
              <Input placeholder="请输入节点层级" disabled/>
            )}
            </FormItem>
          </Col>
					<Col span={12}>
            <FormItem label="排序号">
            {getFieldDecorator('sortNo', {
              initialValue: treeNodeData.sortNo
            })(
              <Input placeholder="请输入排序号" />
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

TreeConfigForm.propTypes = {
}

TreeConfigForm.defaultProps = {

}

export default Form.create()(TreeConfigForm)
