import React, { useEffect } from 'react'
import FilterTable from './components/filter_table/index'
import { IDicItemProps, findDic, formatDicitems, DicItem } from '@/services/Dicitem'
import { useSetState } from 'ahooks'

export default function () {
  const [initData, setInitData] = useSetState<{ interviewee: IDicItemProps[]; LAST_STEP_NAME: string }>({
    interviewee: [],
    LAST_STEP_NAME: '',
  })

  const { INTERVIEWEE_STATUS } = DicItem
  useEffect(() => {
    const dicCondition = [INTERVIEWEE_STATUS]
    const getInitData = async () => {
      const [dicListData] = await Promise.all([findDic({ groupName: dicCondition })])

      const dicData = formatDicitems(dicListData.data)
      const LAST_STEP_NAME = dicData[INTERVIEWEE_STATUS][dicData[INTERVIEWEE_STATUS].length - 1].name

      setInitData({
        interviewee: dicData[INTERVIEWEE_STATUS],
        LAST_STEP_NAME,
      })
    }
    getInitData()
  }, [setInitData, INTERVIEWEE_STATUS])
  return (
    <div className="InterviewManage-page">
      {/* 基础的过滤区加表格的组合 */}
      <FilterTable dataSource={initData} />
    </div>
  )
}
