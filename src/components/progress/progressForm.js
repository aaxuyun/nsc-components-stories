import { Form, Input, Row, Col, DatePicker } from "antd"
import React from "react"
import PropTypes from 'prop-types'
import moment from 'moment';
import UploadFile from '@/components/progress/UploadFile'
import { datetimeFormat } from '@/utils/format'


const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

class ProgressForm extends React.Component {
  formUploadRender () {
    const { getFieldDecorator } = this.props.form
    const { formData, readonly } = this.props
    return (
      <Form.Item {...formItemLayout} label="附件资料" extra="文件大小不能超过100M">
        {getFieldDecorator("upload", {
          valuePropName: "fileList",
        })(
          <UploadFile 
            progressDetailId={formData.id} 
            projectId={formData.projectId} 
            images={formData.attachments} 
            disabled={readonly}
          ></UploadFile>
        )}
      </Form.Item>
    )
  }

  render() {
    let { formData, readonly } = this.props
    const { getFieldDecorator } = this.props.form

    const format = "YYYY-MM-DD"
    const completedAtValue = formData.completedAt ? moment(formData.completedAt, format) : undefined
    const planAccomplishDate = formData.planAccomplishDate ? moment(formData.planAccomplishDate, format) : undefined

    return (
      <Form>
        <Form.Item {...formItemLayout} label="所在线路">
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator("lineName", {
                initialValue: formData.lineName,
                rules: [{ required: true }]
              })(<Input disabled={true} />)}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item {...formItemLayout} label="关键节点">
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('statusName', {
                initialValue: formData.progressStatusDefName,
                rules: [{ required: true }]
              })(<Input disabled={true} />)}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item {...formItemLayout} label="预计完成时间">
          {getFieldDecorator('planAccomplishDate', {
            initialValue: planAccomplishDate,
            // rules: [{ type: 'object', required: true }],
          })(
            <DatePicker disabled={true} />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="完成时间">
          {getFieldDecorator('completedAt', {
            initialValue: completedAtValue,
            rules: [{ type: 'object', required: true, message: '请输入完成时间' }],
          })(
            <DatePicker showTime format={format} disabled={readonly} />
          )}
        </Form.Item>

        {this.formUploadRender()}

        <Form.Item {...formItemLayout} label="备注">
          {getFieldDecorator('comment', {
            initialValue: formData.comment,
          })(<TextArea rows={4} style={{maxWidth: '320px'}} disabled={readonly}/>)}
        </Form.Item>
      </Form>
    )
  }
}

ProgressForm.propTypes = {
  formData: PropTypes.object.isRequired,
  readonly: PropTypes.bool
}
ProgressForm.defaultProps = {
  readonly: true
}

export default Form.create({ name: "register" })(ProgressForm)
