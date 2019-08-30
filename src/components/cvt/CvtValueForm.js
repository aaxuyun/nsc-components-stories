import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col } from 'antd'
import CvtSelectAutoFetch from '@/components/cvt/CvtSelectAutoFetch'

const FormItem = Form.Item

class CvtForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cvtData: props.cvtData || {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('cvtData' in nextProps) {
      this.setState({ cvtData: nextProps.cvtData })
    }
  }

  render () {
    const { form, cvtType } = this.props
    const { cvtData } = this.state
    const { getFieldDecorator } = form

    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="字典字段" required>
            {getFieldDecorator('code', {
              rules: [{ required: true, message: '字典字段不能为空' }],
            })(
              <CvtSelectAutoFetch type={cvtType} placeholder="请选择字典字段" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="文字内容" required>
            {getFieldDecorator('value', {
              rules: [{ required: true, message: '文字内容不能为空' }],
            })(
              <Input placeholder="请输入文字内容" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="备注" required>
            {getFieldDecorator('comment', {
            })(
              <Input placeholder="请输入备注" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="排序号" required>
            {getFieldDecorator('sortNo', {
              rules: [{ required: true, message: '排序号不能为空' }],
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

CvtForm.propTypes = {
  cvtData: PropTypes.object.isRequired,
  cvtType: PropTypes.string.isRequired
}

CvtForm.defaultProps = {
  cvtData: {}
}

export default Form.create({
  mapPropsToFields: props => ({
    code: Form.createFormField({ value: props.cvtData.code }),
    value: Form.createFormField({ value: props.cvtData.value }),
    comment: Form.createFormField({ value: props.cvtData.comment }),
    sortNo: Form.createFormField({ value: props.cvtData.sortNo })
  })
})(CvtForm)
