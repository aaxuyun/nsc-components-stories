import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table from '@/components/Table'
import { message } from 'antd'
import TooltipButton from '@/lib/components/TooltipButton'
import EditCompanyModal from '@/containers/modals/admin/company/EditCompany'
import CompanyDrawer from '@/containers/drawers/CompanyDrawer'
import confirm from '@/components/confirm'
import * as companyAPI from '@/apis/companies'
import { noop } from '@/utils/func'

class CompanyList extends Component{

  clickDeleteHandler = (proj) => {
    const { onDeleted } = this.props
    confirm({
      title: '删除确认',
      content: `确认删除该工程：${proj.name}`,
      onOk: () => {
        companyAPI.destroy(proj.id)
        .then(() => {
          message.success('删除成功')
          onDeleted()
        })
        .catch(() => message.error('删除失败'))
      }
    })
  }

  clickRecycleHandler = (proj) => {
    const { onRecycled } = this.props
    confirm({
      title: '还原确认',
      content: `确认还原该工程：${proj.name}`,
      onOk: () => {
        companyAPI.update({
          id: proj.id,
          isDeleted: 0
        })
        .then(() => {
          message.success('还原成功')
          onRecycled()
        })
        .catch(() => message.error('还原失败'))
      }
    })
  }

  render () {
    const {
      listData = [],
      pagination, // { current, total, pageSize, onChange(page, pageSize) }
      onEdited,
      enabledActions,
      ...restProps
    } = this.props
    const columns = [
      { key: 'name', title: '单位名称', dataIndex: 'name', render: (v, r) => <CompanyDrawer id={r.id}>{v}</CompanyDrawer> },
      { key: 'shortName', title: '单位简称', dataIndex: 'shortName' },
      { key: 'code', title: '单位编码', dataIndex: 'code' },
      { key: 'email', title: '邮箱', dataIndex: 'email' },
      { key: 'telephone', title: '电话', dataIndex: 'tel' },
      { key: 'orgzCode', title: '机构代码', dataIndex: 'orgzCode' },
      { key: 'opts', title: '操作', dataIndex: 'opts' , render: (v, r, i) => {
        const actions = [
          {key : "recycle", component : <TooltipButton key={`recycle-${i}`} icon="rollback" tip="还原" onClick={() => this.clickRecycleHandler(r)} />},
          {key : "edit", component : <EditCompanyModal key={`edit-${i}`} companyData={r} onEdited={onEdited}><TooltipButton icon="edit" tip="编辑" /></EditCompanyModal>},
          {key : "delete", component : <TooltipButton key={`delete-${i}`} icon="delete" type="danger" tip="删除" onClick={() => this.clickDeleteHandler(r)} />}
        ].filter( c => {
          if(enabledActions[0]==='*'){
            return true
          }else{
            return enabledActions.includes(c.key)
          }
        })
        return actions.map( item => {
          return item.component
        })
      }
      }, // 密码，头像，编辑，删除
    ]
    return (
      <Table
        rowKey={r => r.id}
        columns={columns}
        dataSource={listData}
        pagination={pagination}
        {...restProps}
      />
    )
  }
}

CompanyList.propTypes = {
  listData: PropTypes.array.isRequired,
  onEdited: PropTypes.func,
  onDeleted: PropTypes.func,
  onRecycled: PropTypes.func,
  enabledActions: PropTypes.array
}

CompanyList.defaultProps = {
  listData: [],
  onEdited: noop,
  onDeleted: noop,
  onRecycled: noop,
  enabledActions: ['*']
}
export default CompanyList
