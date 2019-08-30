import React, { Component } from 'react'
import SupervisorTree from './SupervisorTree'
import styles from './Sider.css'

class Sider extends Component {

  clickHandler = (item) => {
    const { onTypeClicked } = this.props
    onTypeClicked && onTypeClicked(item.type, item.subType)
  }

  render () {
    return (
      <div className={styles.sider}>
        <SupervisorTree onClicked={this.clickHandler}/>
      </div>
    )
  }
}

export default Sider
