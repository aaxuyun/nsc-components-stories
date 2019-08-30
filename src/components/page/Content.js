import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import styles from './ContentPane.css'

const { Content } = Layout

const NAV_HEIGHT = 64
const calculateHeight = () => window.innerHeight - NAV_HEIGHT

class MyContent extends Component {

  constructor (props) {
    super(props)
    this.state = {
      height: calculateHeight()
    }
  }

  componentDidMount () {
    const { fullHeight = false } = this.props
    fullHeight && window.addEventListener('resize', this.updateHeight)
  }

  componentWillUnmount () {
    const { fullHeight = false } = this.props
    fullHeight && window.removeEventListener('resize', this.updateHeight)
  }

  updateHeight = () => {
    this.setState({ height: calculateHeight() })
  }

  render () {
    const { children, fullHeight, ...restProps } = this.props
    const { height } = this.state
    const style = {
      position: 'relative',
      padding: fullHeight ? 0 : '0 30px',
      height: fullHeight ? height : 'auto'
    }

    return (
      <Content style={style} {...restProps}>{children}</Content>
    )
  }
}

MyContent.propTypes = {
  fullHeight: PropTypes.bool.isRequired
}

MyContent.defaultProps = {
  fullHeight: false
}

export default MyContent
