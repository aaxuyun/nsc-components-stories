import React from 'react'
import styles from './ContentPane.css'

export default ({ children, ...restProps }) => {
  return (
    <div className={styles.contentPane} {...restProps}>{children}</div>
  )
}
