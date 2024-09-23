import React, { useEffect, useState } from 'react'
import FilterTable from './components/filter_table'
import { IBusProps, getAllBus } from '@/services/Bu'

export default function () {
  const [initData, setInitData] = useState<{
    bu: IBusProps[];
  }>({ fn: [], bu: [] })
  useEffect(() => {
    const getInitData = async () => {
      const [BUListData] = await Promise.all([getAllBus()])
      setInitData({ bu: BUListData.data })
    }
    getInitData()
  }, [])
  return (
    <div className="FunctionManage-page">
      {/* 基础的过滤区加表格的组合 */}
      <FilterTable dataSource={initData} />
    </div>
  )
}
