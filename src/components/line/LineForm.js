import React, { Component } from 'react'
import PropTypes, { object } from 'prop-types'
import { Form, Input, Select, Row, Col, InputNumber as AntInputNumber } from 'antd'
import CvtValueSelectorAutoFetch from '@/components/cvt/CvtValueSelectorAutoFetch'
import DistrictMultipleTreeSelectAutoFetch from '@/components/district/DistrictMultipleTreeSelectAutoFetch'

const FormItem = Form.Item
class InputNumber extends Component {
  render () {
    return <AntInputNumber style={{width:'100%'}} {...this.props} />
  }
}

class LineForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lineData: props.lineData || {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('lineData' in nextProps) {
      this.setState({ lineData: nextProps.lineData })
    }
  }

  render () {
    const { lineData } = this.state
    const { getFieldDecorator, setFieldsValue } = this.props.form

    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="线路名称" required>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '线路名称不能为空' }],
              initialValue: lineData.name
            })(
              <Input placeholder="请输入线路名称" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="线路长度">
            {getFieldDecorator('length', {
              rules: [{ type: 'number', message: '请输入数字类型' }],
              initialValue: lineData.length
            })(
              <InputNumber placeholder="请输入线路长度" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="电压等级" required>
            {getFieldDecorator('voltageLevel', {
              rules: [{ required: true, message: '电压等级不能为空' }],
              initialValue: lineData.voltageLevel
            })(
              <CvtValueSelectorAutoFetch cvtType='base' cvtCode='VOLTAGE_LEVEL' placeholder="请选择电压等级"/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="排序号">
            {getFieldDecorator('sortNo', {
              rules: [{ type: 'number', message: '请输入数字类型' }],
              initialValue: lineData.sortNo
            })(
              <InputNumber placeholder="请输入排序号" min={1}/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="规划投资（万元）">
            {getFieldDecorator('planInvestment', {
              initialValue: lineData.planInvestment
            })(
              <Input placeholder="请输入规划投资（万元）"/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="规划运营年限">
            {getFieldDecorator('planOptYear', {
              initialValue: lineData.planOptYear
            })(
              <Input placeholder="请输入规划运营年限"/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="目标来源">
            {getFieldDecorator('source', {
              initialValue: lineData.source
            })(
              <Input placeholder="请输入目标来源" style={{width:'100%'}}/>
            )}
            </FormItem>
          </Col> 
          <Col span={12}>
            <FormItem label="目标所在地">
              {getFieldDecorator('dists', {
                initialValue: lineData.dists
              })(
                <DistrictMultipleTreeSelectAutoFetch getTreeData={(allCheckedNodes) => { setFieldsValue({ dists: allCheckedNodes }) }}></DistrictMultipleTreeSelectAutoFetch>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="项目规模">
            {getFieldDecorator('scale', {
              initialValue: lineData.scale
            })(
              <Input.TextArea placeholder="请输入项目规模" style={{width:'100%'}} rows={4}/>
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="备注">
            {getFieldDecorator('comment', {
              initialValue: lineData.comment
            })(
              <Input.TextArea placeholder="请输入备注" style={{width:'100%'}} rows={4}/>
            )}
            </FormItem>
          </Col>
         
        </Row>
      </Form>
    )
  }
}

LineForm.propTypes = {

}

LineForm.defaultProps = {

}

export default Form.create()(LineForm)
