import React, { Component, createElement } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

/**
 * usage:
 *  <DynamicMountComponent component={Drawer} visible={true}>
 *    ...
 *  </DynamicMountComponent>
 */
class DynamicMountComponent extends Component {

  createContainer () {
    // prevent create container repeatly
    if (this.container) {
      return
    }

    const div = document.createElement('div')
    document.body.appendChild(div)
    this.container = div
  }

  removeContainer () {
    if (this.container) {
      this.container.remove()
      this.container = null
    }
  }

  shouldComponentUpdate({ visible }) {
    return true
  }

  componentDidUpdate () {
    if (this.props.visible) {
      this.renderComponent()
    } else {
      this.removeContainer()
    }
  }

  componentWillUnmount () {
    this.removeContainer()
  }

  renderComponent () {
    const { visible, component, children, ...restProps } = this.props
    this.createContainer()
    ReactDOM.render(createElement(component, restProps, children), this.container)
  }

  render () {
    return null
  }
}

DynamicMountComponent.propTypes = {
  visible: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired
}

DynamicMountComponent.defaultProps = {
  visible: false
}

export default DynamicMountComponent
