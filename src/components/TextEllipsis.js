import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './TextEllipsis.css'

class TextEllipsis extends Component {
	state = {
    overflowActive: false
  }

  isEllipsisActive(e) {
    return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth
  }

  componentDidMount() {
    this.setState({ overflowActive: this.isEllipsisActive(this.element) })
  }

  render () {
		const { overflowActive } = this.state
		const { text, overflowStyle, ...restProps } = this.props
		return (
	    <div ref={ref => (this.element = ref)} style={overflowActive ? overflowStyle : {}} className={styles.text} title={text}>
	      {text}
	    </div>
	  )
	}
}
TextEllipsis.propTypes = {
  text:  PropTypes.string,
  overflowStyle: PropTypes.object
}

TextEllipsis.defaultProps = {
  overflowStyle: {}
}

export default TextEllipsis
