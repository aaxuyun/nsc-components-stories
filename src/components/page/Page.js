import React from 'react'
import Content from './Content'
import ContentPane from './ContentPane'

export default ({ children, fullHeight }) => {
  return (
    <Content fullHeight={fullHeight}>
      <ContentPane style={{ margin: fullHeight ? 0 : '24px 0' }}>{children}</ContentPane>
    </Content>
  )
}
