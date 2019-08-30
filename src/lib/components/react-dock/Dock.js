import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import { styles, getFullSize, getResizerStyles, getDimStyles, getDockStyles } from './utils'
const resizeBind = require('element-resize-event')
const resizeUnbind = require('element-resize-event').unbind

class Dock extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isControlled: typeof props.size !== 'undefined',
      size: props.size || props.defaultSize,
      isDimHidden: !props.isVisible,
      fullWidth: props.container === 'window' && window.innerWidth,
      fullHeight: props.container === 'window' && window.innerHeight,
      isTransitionStarted: false,
      isContainerResizing: false
    }
  }

  componentDidMount () {
    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('mousemove', this.handleMouseMove)

    if (this.props.container === 'window') {
      window.addEventListener('resize', this.handleResize)
    } else {
      resizeBind(this.getContainer(), this.handleResize)
    }

    if (!this.state.fullWidth) {
      this.updateContainerSize()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('mousemove', this.handleMouseMove)
    
    if (this.props.container === 'window') {
      window.removeEventListener('resize', this.handleResize)
    } else {
      resizeUnbind(this.getContainer(), this.handleResize)
    }
  }

  componentWillReceiveProps (nextProps) {
    const isControlled = typeof nextProps.size !== 'undefined'

    this.setState({ isControlled })

    if (isControlled && this.props.size !== nextProps.size) {
      this.setState({ size: nextProps.size })
    } else if (this.props.fluid !== nextProps.fluid) {
      this.updateSize(nextProps)
    }

    if (this.props.isVisible !== nextProps.isVisible) {
      this.setState({ isTransitionStarted: true })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible !== prevProps.isVisible) {
      if (!this.props.isVisible) {
        window.setTimeout(() => this.hideDim(), this.props.duration)
      } else {
        this.setState({ isDimHidden: false })
      }

      window.setTimeout(() => this.setState({ isTransitionStarted: false }), 0)
    }
  }

  getContainer () {
    const { container } = this.props
    return container === 'parent' ? findDOMNode(this).parentElement : window
  }

  getContainerDimension () {
    const { container } = this.props
    if (container === 'parent') {
      const { parentElement } = findDOMNode(this)
      return {
        width: parentElement.clientWidth,
        height: parentElement.clientHeight
      }
    } else {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }

  updateSize (props) {
    const { fullWidth, fullHeight } = this.state

    this.setState({
      size: props.fluid
        ? this.state.size / getFullSize(props.position, fullWidth, fullHeight)
        : getFullSize(props.position, fullWidth, fullHeight) * this.state.size
    })
  }

  transitionEnd = () => {
    this.setState({ isTransitionStarted: false })
  }

  hideDim = () => {
    if (!this.props.isVisible) {
      this.setState({ isDimHidden: true })
    }
  }

  updateContainerSize = (containerResize) => {
    const { width, height } = this.getContainerDimension()
    const sizeState = {
      fullWidth: width,
      fullHeight: height
    }
    console.log('updateContainerSize', sizeState)

    if (containerResize) {
      this.setState({
        ...sizeState,
        isResizing: true,
        isContainerResizing: containerResize
      })

      this.debouncedUpdateContainerSizeEnd()
    } else {
      this.setState(sizeState)
    }
  }

  updateContainerSizeEnd = () => {
    this.setState({
      isResizing: false,
      isContainerResizing: false
    })
  }

  debouncedUpdateContainerSizeEnd = debounce(this.updateContainerSizeEnd, 30)

  handleDimClick = () => {
    if (this.props.dimMode === 'opaque') {
      this.props.onVisibleChange && this.props.onVisibleChange(false);
    }
  }

  handleResize = () => {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.updateContainerSize.bind(this, true))
    } else {
      this.updateContainerSize(true)
    }
  }

  handleWrapperLeave = () => {
    this.setState({ isResizing: false })
  }

  handleMouseDown = () => {
    this.setState({ isResizing: true })
  }

  handleMouseUp = () => {
    this.setState({ isResizing: false })
  }

  handleMouseMove = e => {
    if (!this.state.isResizing || this.state.isContainerResizing) {
      return
    }
    e.preventDefault()

    const { position, fluid, onSizeChange } = this.props
    const { fullWidth, fullHeight, isControlled } = this.state
    const { clientX: x, clientY: y } = e
    let size

    switch(position) {
      case 'left':
        size = fluid ? x / fullWidth : x;
        break;
      case 'right':
        size = fluid ? (fullWidth - x) / fullWidth : (fullWidth - x);
        break;
      case 'top':
        size = fluid ? y / fullHeight : y;
        break;
      case 'bottom':
        size = fluid ? (fullHeight - y) / fullHeight : (fullHeight - y);
      break;
    }

    onSizeChange && onSizeChange(size)

    if (!isControlled) {
      this.setState({ size })
    }
  }

  render () {
    const { children, zIndex, dimMode, position, isVisible } = this.props
    const { isResizing, size, isDimHidden } = this.state

    const dimStyles = Object.assign({}, ...getDimStyles(this.props, this.state))
    const dockStyles = Object.assign({}, ...getDockStyles(this.props, this.state))
    const resizerStyles = Object.assign({}, ...getResizerStyles(position))

    console.log('size', size)

    return (
      <div style={Object.assign({}, styles.wrapper, { zIndex })}>
        {dimMode !== 'none' && !isDimHidden &&
          <div style={dimStyles} onClick={this.handleDimClick} />
        }
        <div style={dockStyles}>
          <div style={resizerStyles} onMouseDown={this.handleMouseDown} />
          <div style={styles.dockContent}>
            {typeof children === 'function'
              ? children({ position, isResizing, size, isVisible })
              : children
            }
          </div>
        </div>
      </div>
    )
  }
}

Dock.propTypes = {
  container: PropTypes.oneOf(['window', 'parent']),
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  zIndex: PropTypes.number,
  fluid: PropTypes.bool,
  size: PropTypes.number,
  defaultSize: PropTypes.number,
  dimMode: PropTypes.oneOf(['none', 'transparent', 'opaque']),
  isVisible: PropTypes.bool,
  onVisibleChange: PropTypes.func,
  onSizeChange: PropTypes.func,
  dimStyle: PropTypes.object,
  dockStyle: PropTypes.object,
  duration: PropTypes.number
}

Dock.defaultProps = {
  container: 'window',
  position: 'left',
  zIndex: 99999999,
  fluid: true,
  defaultSize: 0.3,
  dimMode: 'opaque',
  duration: 200
}

export default Dock