import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, Icon, Modal, message } from 'antd'
import 'rc-collapse/assets/index.css'
import Collapse, { Panel } from 'rc-collapse'
import { noop } from '@/utils/func'
import styles from './SupervisorTree.css'

const { confirm } = Modal

const folderCvtMapping = item => ({
  key: `${item.code}-${item.key}`,
  type: item.code,
  subType: item.key,
  name: item.value,
  children: []
})

class SupervisorTree extends Component{
  state = {
    folders: [],
    activeKeys: [],
    selectedKey: '',
  }

  componentDidMount () {
    if (!window.CVT.SUPERVISOR_ENTRUSTMENT || !window.CVT.SUPERVISOR_SUPERVISION) {
      console.log('window.CVT.SUPERVISOR not configed')
      return
    }

    const folders = [
      { key: 'SUPERVISOR_SUPERVISION', name: '专项督导', type: "SUPERVISOR_SUPERVISION", subType: "", children:
        Object.values(window.CVT.SUPERVISOR_SUPERVISION).map(folderCvtMapping)
      },
      { key: 'SUPERVISOR_ENTRUSTMENT', name: '专项委托', type: "SUPERVISOR_ENTRUSTMENT", subType: "", children:
        Object.values(window.CVT.SUPERVISOR_ENTRUSTMENT).map(folderCvtMapping)
      },
    ]

    const firstItem = folders[0].children[0]
    this.setState({
      folders,
      activeKeys: folders.map(item => item.key),
      selectedKey: firstItem.key
    })
    const { onClicked } = this.props
    onClicked && onClicked(firstItem)
  }

  onTypeClicked = (item) => {
    this.setState({ selectedKey: item.key })
    const { onClicked } = this.props
    onClicked && onClicked(item)
  }

  onCollapseChange = (activeKeys) => {
    this.setState({ activeKeys })
  }

  renderPanels = (data) => {
    return data.map(item => {
      return (
        <Panel header={item.name} key={item.key}>
          {item.children && this.renderTypes(item.children)}
        </Panel>
      )
    })
  }

  renderTypes = (data) => {
    const { selectedKey } = this.state
    return data.map(item => {
      return (
        <div
          key={item.key}
          className={styles.item}
          style={item.key === selectedKey ? {backgroundColor: '#109c98', color: '#fff'} : undefined}
          onClick={() => this.onTypeClicked(item)}
        >
          <span><Icon type='book'/> {item.name}</span>
        </div>
      )
    })
  }

  render () {
    const { folders, activeKeys } = this.state
    return (
      <div className={styles.collapsePanel}>
        { folders.length > 0
          ? <Collapse
              onChange={this.onCollapseChange}
              activeKey={activeKeys}
            >
              {this.renderPanels(folders)}
            </Collapse>
          : <div style={{textAlign: 'center'}}>暂无数据</div>
        }
      </div>
    )
  }
}

SupervisorTree.propTypes = {
  onClicked: PropTypes.func
}

SupervisorTree.defaultProps = {
}

export default SupervisorTree
