import React, { useEffect } from 'react'
import FilterTable from './components/filter_table/index'
import { IBusProps, getAllBus } from '@/services/Bu'
import { IDicItemProps, findDic, DicItem } from '@/services/Dicitem'
import { useSetState } from 'ahooks'

export default function () {
  const [initData, setInitData] = useSetState<{ bu: IBusProps[]; roleList: IDicItemProps[] }>({
    bu: [],
    roleList: [],
  })
  useEffect(() => {
    const getInitData = async () => {
      const dicCondition = [DicItem.ROLE_TYPE]
      const [buListData, dicListData] = await Promise.all([getAllBus(), findDic({ groupName: dicCondition })])
      setInitData({ bu: buListData.data, roleList: dicListData.data })
    }
    getInitData()
  }, [setInitData])
  return (
    <div className="UserManage-page">
      {/* 基础的过滤区加表格的组合 */}
      <FilterTable dataSource={initData} />
    </div>
  )
}
