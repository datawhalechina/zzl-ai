import React, { useEffect } from 'react'
import BasicForm from './components/basic_form'

import { IJobsProps, getAllJobs } from '@/services/Jobs'
import { IDicItemProps, findDic, formatDicitems, DicItem } from '@/services/Dicitem'
import { useSetState } from 'ahooks'

export default function () {
  const [initData, setInitData] = useSetState<{ job: IJobsProps[]; [name: string]: IDicItemProps[] }>({
    job: [],
    resume: [],
    edu: [],
  })
  const { RESUME_ORIGIN, EDUCATION_STATUS } = DicItem

  useEffect(() => {
    const getInitData = async () => {
      const dicCondition = [RESUME_ORIGIN, EDUCATION_STATUS]
      const [jobListData, dicListData] = await Promise.all([getAllJobs(), findDic({ groupName: dicCondition })])
      const dicData = formatDicitems(dicListData.data) || {}
      setInitData({ job: jobListData.data, resume: dicData[RESUME_ORIGIN], edu: dicData[EDUCATION_STATUS] })
    }
    getInitData()
  }, [EDUCATION_STATUS, RESUME_ORIGIN, setInitData])

  return (
    <div className="resumeUpload-page">
      <BasicForm dataSource={initData} />
    </div>
  )
}
