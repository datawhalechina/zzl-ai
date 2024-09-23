import React, { useEffect } from 'react'
import FilterTable from './components/filter_table/index'
import { IBusProps, getAllBus } from '@/services/Bu'
import {
  IDicItemProps,
  DicItem,
  findDic,
  formatDicitems,
} from '@/services/Dicitem'
import { useSetState } from 'ahooks'
import { IUserProps, getAllUsers } from '@/services/User'
import { IJobsProps, getAllJobs } from '@/services/Jobs'

export default function () {
  const [initData, setInitData] = useSetState<{
    bu: IBusProps[];
    interviewee: IDicItemProps[];
    resume: IDicItemProps[];
    users: IUserProps[];
    jobs: IJobsProps[];
  }>({
    bu: [],
    interviewee: [],
    resume: [],
    users: [],
    jobs: [],
  })

  const { RESUME_ORIGIN, INTERVIEWEE_STATUS } = DicItem
  useEffect(() => {
    const getInitData = async () => {
      const dicCondition = [RESUME_ORIGIN, INTERVIEWEE_STATUS]
      const [buListData, dicListData, userListData, jobListData] = await Promise.all([
        getAllBus(),
        findDic({ groupName: dicCondition }),
        getAllUsers(),
        getAllJobs(),
      ])
      const dicData = formatDicitems(dicListData.data)
      setInitData({
        bu: buListData.data,
        interviewee: dicData[INTERVIEWEE_STATUS],
        resume: dicData[RESUME_ORIGIN],
        users: userListData.data,
        jobs: jobListData.data,
      })
    }
    getInitData()
  }, [setInitData, INTERVIEWEE_STATUS, RESUME_ORIGIN])
  return (
    <div className="ResumeManage-page">
      {/* 基础的过滤区加表格的组合 */}
      <FilterTable dataSource={initData} />
    </div>
  )
}
