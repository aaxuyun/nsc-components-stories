import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col, InputNumber } from 'antd'

const FormItem = Form.Item

class TreeConfigForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      treeData: props.treeData || {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('treeData' in nextProps) {
      this.setState({ treeData: { ...nextProps.treeData } })
    }
  }

  render () {
    const { treeData } = this.state
    const { getFieldDecorator } = this.props.form

    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="节点Key">
            {getFieldDecorator('key', {
							rules: [{ required: true, message: '节点Key不能为空' }],
              initialValue: treeData.key
            })(
              <Input placeholder="请输入节点Key"/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="最大层级">
            {getFieldDecorator('maxLevel', {
							rules: [{ required: true, message: '最大层级不能为空' }],
              initialValue: treeData.maxLevel
            })(
              <InputNumber placeholder="请输入最大层级" style={{width:'100%'}}/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="备注" required>
            {getFieldDecorator('comment', {
              initialValue: treeData.comment
            })(
              <Input placeholder="请输入备注" />
            )}
            </FormItem>
          </Col>
					<Col span={12}>
            <FormItem label="排序号">
            {getFieldDecorator('sortNo', {
              initialValue: treeData.sortNo
            })(
              <InputNumber placeholder="请输入排序号" style={{width:'100%'}}/>
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
