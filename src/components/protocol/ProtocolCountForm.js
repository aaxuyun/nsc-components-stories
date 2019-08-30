import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Tooltip, Badge, Row, Col, InputNumber, Collapse } from 'antd'

const Panel = Collapse.Panel
const FormItem = Form.Item

const getProtocolClasses = (category) => {
  return Object.values(
    category === 'type' ? window.CVT.PROTOCOL_TYPE : window.CVT.PROTOCOL_LEVEL
  ).map(item => ({
    key: item.key,
    name: item.value,
    dbKey: item.value3
  }))
}


class InputNumberForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled : true
    }
  }

  onChangeHander=value=>{
    if(value === 0){
      this.setState({disabled:true})
    }else{
      this.setState({disabled:false})
    }
  }

  renderGainLabel = (item, type) => {
    const match = this.props.statisticInfo.find(s => s.group === type && s.key === item.key)
    const count = match ? match.count : 0
    return (
      <span>
        {`已取得（${item.name}）`}
        <Tooltip title={`实际[${item.name}]上传数量为${count}条`}>
          <Badge count={count} showZero style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />
        </Tooltip>
      </span>
    )
  }

  render(){
    const {item, formData, form}=this.props
    const { getFieldDecorator } =form
    return(
      <Row gutter={40}>
        <Col span={12}>
          <FormItem label={`拟取得（${item.name}）`}>
          {getFieldDecorator(`${item.dbKey}`, {
            rules: [{ required: true, message: `拟取得${item.name}数量不能为空` }],
            initialValue: formData[`${item.dbKey}`] || 0
          })(
            <InputNumber min={0} placeholder={`请输入拟取得${item.name}数量`} style={{width:'100%'}} onChange={this.onChangeHander} />
          )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={this.renderGainLabel(item, 'TYPE')}>
          {getFieldDecorator(`${item.dbKey}Gain`, {
            rules: [{ required: true, message: `已取得${item.name}数量不能为空` }],
            initialValue: formData[`${item.dbKey}Gain`] || 0
          })(
            <InputNumber min={0} placeholder={`请输入已取得${item.name}数量`} style={{width:'100%'}} disabled={this.state.disabled}/>
          )}
          </FormItem>
        </Col>
      </Row>
    )
  }
}


class ProtocolCountForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: props.formData || {}
    }
  }
  componentWillReceiveProps (nextProps) {
    if ('formData' in nextProps) {
      this.setState({ formData: nextProps.formData })
    }
  }

  render () {
    const { form, statisticInfo } = this.props
    const { formData } = this.state
    const { getFieldDecorator } = form

    const protocolTypeClasses = getProtocolClasses('type')
    const protocolLevelClasses = getProtocolClasses('level')

    return (
      <Form layout="vertical">
        <Collapse defaultActiveKey={['1']}>
          <Panel header="协议类型" key="1">
          { protocolTypeClasses.map(item => {
            return (
              <InputNumberForm key={item.key} formData={formData} form={form} item={item} statisticInfo={statisticInfo} />
            )
          })}
          </Panel>
          <Panel header="协议级别" key="2">
          { protocolLevelClasses.map(item => {
            return (
            <InputNumberForm key={item.key} formData={formData} form={form} item={item} statisticInfo={statisticInfo} />
            )
          })}
          </Panel>
        </Collapse>
      </Form>
    )
  }
}

ProtocolCountForm.propTypes = {
  formData: PropTypes.object.isRequired,
  statisticInfo: PropTypes.array
}

ProtocolCountForm.defaultProps = {
  formData: {},
  statisticInfo: []
}

export default Form.create()(ProtocolCountForm)
