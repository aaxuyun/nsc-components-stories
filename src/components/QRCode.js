import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toCanvas } from 'qrcode'

class QRCode extends Component {
  componentDidMount () {
    this.renderQRCode(this.props.text)
  }

  componentWillReceiveProps (props) {
    if (props.text !== this.props.text) {
      this.renderQRCode(props.text)
    }
  }

  renderQRCode (text) {
    const { options } = this.props
    toCanvas(
      this.canvas,
      text,
      { margin: 0, width: 148, ...options },
      e => {}
    )
  }

  render () {
    const { text, options, ...rest} = this.props
    return <canvas ref={e => this.canvas = e} {...rest}></canvas>
  }
}

QRCode.propTypes = {
  text: PropTypes.string.isRequired,
  options: PropTypes.object
}

QRCode.defaultProps = {
  text: '',
  options: {}
}

export default QRCode
