import React, { useEffect, useState } from 'react'
import FilterTable from './components/filter_table/index'
import { IFunctionProps, getAllFns } from '@/services/Function'
import { IBusProps, getAllBus } from '@/services/Bu'

export default function () {
  const [fnList, setFnList] = useState<IFunctionProps[]>()
  const [buList, setBUList] = useState<IBusProps[]>()
  useEffect(() => {
    const getInitData = async () => {
      const [fnListData, buListData] = await Promise.all([getAllFns(), getAllBus()])
      setFnList(fnListData.data)
      setBUList(buListData.data)
    }
    getInitData()
  }, [])
  return (
    <div className="Job-page">
      {/* 基础的过滤区加表格的组合 */}
      <FilterTable dataSource={{ fn: fnList, bu: buList }} />
    </div>
  )
}
