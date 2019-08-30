import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Tab, Input, Col, Cascader } from 'antd'
import { getGeometryLength, getGeometryArea } from '@/utils/geometry'
import TypeSelector from '@/components/ground-object/TypeSelector'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const FormItem = ({ children, ...restProps }) => <Form.Item {...restProps} {...formItemLayout}>{children}</Form.Item>

class GroundObjectForm extends Component {

  constructor (props) {
    super(props)
    this.state = {
      length: null,
      area: null,
    }
  }

  componentDidMount () {
    this.renderGeomertyProps()
  }

  async renderGeomertyProps () {
    const { geoType, geometryJson } = this.props.gobjData
    switch (geoType) {
      case 'polyline':
        return getGeometryLength(geometryJson, 'kilometers').then(length => {
          length && this.setState({ length })
        })
        break;
      case 'polygon':
        return  getGeometryArea(geometryJson, 'square-kilometers').then(area => {
          area && this.setState({ area })
        })
        break;
      default:
        return null
    }
  }

  render () {

    const { length, area } = this.state
    const { getFieldDecorator } = this.props.form
    const { folderTree, gobjData, currentCascader } = this.props

    return (
      <Form >
        <Col span={12}>
          <FormItem label="名称" required>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '编号不能为空' }],
              initialValue: gobjData.name
            })(
              <Input placeholder="请输入编号" />
            )}
          </FormItem>
        </Col>
        {
          length &&
          <Col span={12}>
            <FormItem label="线路长度(km)">
              <Input value={length.toFixed(2)} readOnly/>
            </FormItem>
          </Col>
        }
        {
          area &&
          <Col span={12}>
            <FormItem label="区域面积(k㎡)">
              <Input value={area.toFixed(2)} readOnly/>
            </FormItem>
          </Col>
        }

        <Col span={12}>
          <FormItem label="地物类型">
            {getFieldDecorator('cascader', {
              rules: [{ required: true, message: '地物类型不能为空' }],
              initialValue: currentCascader
            })(
              <TypeSelector.GobjCascader options={folderTree}></TypeSelector.GobjCascader>
            )}
          </FormItem>
        </Col>

      </Form>
    )
  }
}

GroundObjectForm.propTypes = {
  folderTree: PropTypes.array,
  gobjData: PropTypes.object,
}

GroundObjectForm.defaultProps = {
  folderTree: [],
  gobjData: {},
}

export default Form.create()(GroundObjectForm)