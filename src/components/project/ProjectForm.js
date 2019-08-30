import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col, InputNumber as AntInputNumber } from 'antd'
import CvtValueSelectorAutoFetch from '@/components/cvt/CvtValueSelectorAutoFetch'
import DistrictSelectorAutoFetch from '@/components/district/DistrictSelectorAutoFetch'

const FormItem = Form.Item
const DISTRICT_LEVEL = DistrictSelectorAutoFetch.LEVEL

class InputNumber extends Component {
  render () {
    return <AntInputNumber style={{width:'100%'}} {...this.props} />
  }
}

class ProjectForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      projectData: props.projectData || {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('projectData' in nextProps) {
      this.setState({ projectData: nextProps.projectData })
    }
  }

  render () {
    const { form } = this.props
    const { projectData } = this.state
    const { getFieldDecorator } = form

    return (
      <Form layout="vertical">
        <Row gutter={40}>
          <Col span={12}>
            <FormItem label="工程名称" required>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '工程名称不能为空' }],
              initialValue: projectData.name
            })(
              <Input placeholder="请输入工程名称" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="工程简称">
            {getFieldDecorator('shortName', {
              rules: [],
              initialValue: projectData.shortName
            })(
              <Input placeholder="请输入工程简称" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="工程编码" required>
            {getFieldDecorator('code', {
              rules: [{ required: true, message: '工程编码不能为空' }],
              initialValue: projectData.code
            })(
              <Input placeholder="请输入工程编码" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="省份" required>
            {getFieldDecorator('projectDist', {
              rules: [{ required: true, message: '省份不能为空' }],
              initialValue: projectData.projectDist
            })(
              <DistrictSelectorAutoFetch placeholder="请选择省份" level={DISTRICT_LEVEL.PROVINCE} mode="multiple" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="电压等级" required>
            {getFieldDecorator('voltageLevel', {
              rules: [{ required: true, message: '电压等级不能为空' }],
              initialValue: projectData.voltageLevel
            })(
              <CvtValueSelectorAutoFetch cvtType="base" cvtCode="VOLTAGE_LEVEL" placeholder="请输入电压等级" style={{width:'100%'}} />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="线路长度">
            {getFieldDecorator('lineLength', {
              initialValue: projectData.lineLength
            })(
              <InputNumber placeholder="请输入线路长度" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="线路条数">
            {getFieldDecorator('lineCount', {
              initialValue: projectData.lineCount
            })(
              <InputNumber placeholder="请输入线路条数" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="标段数量">
            {getFieldDecorator('sectionCount', {
              initialValue: projectData.sectionCount
            })(
              <InputNumber placeholder="请输入标段数量" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="杆塔总量">
            {getFieldDecorator('towerCount', {
              initialValue: projectData.towerCount
            })(
              <InputNumber placeholder="请输入杆塔总量" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="电压总量">
            {getFieldDecorator('voltageVolume', {
              initialValue: projectData.voltageVolume
            })(
              <Input placeholder="请输入电压总量" />
            )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="变电站数量">
            {getFieldDecorator('convertingStationCount', {
              initialValue: projectData.convertingStationCount
            })(
              <InputNumber placeholder="请输入变电站数量" />
            )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

ProjectForm.propTypes = {
  projectData: PropTypes.object.isRequired
}

ProjectForm.defaultProps = {
  projectData: {}
}

export default Form.create()(ProjectForm)
