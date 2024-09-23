import React from 'react'
import FlowForm from './components/flow_form/index'
import { useParams, Redirect } from 'ice'
import { Message, Loading } from '@alifd/next'
import { IRecordsProps, getRecord, goNext, editRecord, getAllProcessById } from '@/services/interviewee_record'
import { IDicItemProps, findDic, formatDicitems, DicItem } from '@/services/Dicitem'
import { IUserProps, getAllUsers } from '@/services/User'
import { useMount, useSetState } from 'ahooks'

export default function () {
  const { id } = useParams()
  const [loadState, setLoadState] = useSetState<{ isReady: boolean; isError: boolean }>({
    isReady: false,
    isError: false,
  })
  const [initData, setInitData] = useSetState<{
    interviewee: IRecordsProps;
    intervieweeStep: IDicItemProps[];
    id: string;
    status: IDicItemProps[];
    type: IDicItemProps[];
    users: IUserProps[];
    isLast: boolean;
    LAST_STEP_NAME: string;
  }>({
    interviewee: {},
    intervieweeStep: [],
    id,
    status: [],
    type: [],
    users: [],
    isLast: false,
    LAST_STEP_NAME: '',
  })
  useMount(() => {
    const getInitData = async (): Promise<void> => {
      const intervieweeListData = await getRecord(id)
      if (!intervieweeListData.status) {
        setLoadState({ isReady: true, isError: !intervieweeListData.status })
        return
      }
      const { INTERVIEWEE_STATUS, INTERVIEWEE_TYPE } = DicItem

      const dicCondition = [INTERVIEWEE_STATUS, INTERVIEWEE_TYPE]
      const [intervieweeStepListData, dicListData, userListData] = await Promise.all([
        getAllProcessById(intervieweeListData.data.intervieweeId),
        findDic({ groupName: dicCondition }),
        getAllUsers(),
      ])
      const dicData = formatDicitems(dicListData.data)
      setLoadState({ isReady: true, isError: !intervieweeListData.status })
      const LAST_STEP_NAME = dicData[INTERVIEWEE_STATUS][dicData[INTERVIEWEE_STATUS].length - 1].name
      intervieweeListData.status &&
        setInitData({
          interviewee: intervieweeListData.data,
          intervieweeStep: intervieweeStepListData.data,
          status: dicData[INTERVIEWEE_STATUS],
          type: dicData[INTERVIEWEE_TYPE],
          users: userListData.data,
          isLast: intervieweeListData.data.stepName === LAST_STEP_NAME || !!intervieweeListData.data.state,
          LAST_STEP_NAME,
        })
    }
    getInitData()
  })
  if (!loadState.isReady) {
    return <Loading style={{ display: 'block' }} />
  }
  if (loadState.isError) {
    return <Redirect to={'/feedback/404'} />
  }
  const onAgree = async (formData: IRecordsProps, nextConfig): Promise<boolean> => {
    const [viewerId, viewerName] = nextConfig.viewer.split('|')
    const nextCondition = {
      type: formData.type,
      viewerId,
      viewerName,
      intervieweeId: initData.interviewee.intervieweeId,
      intervieweeName: initData.interviewee.intervieweeName,
      step: formData.step,
      stepName: nextConfig.stepName,
      comment: formData.comment,
      state: 1,
      isSuccess: nextConfig.stepName === initData.LAST_STEP_NAME ? 1 : 0,
    }
    const res = await goNext(id, nextCondition)
    !res.status && Message.error(res.msg)

    return !!res.status
  }
  const onRefuse = async (formData: IRecordsProps): Promise<boolean | void> => {
    const res = await editRecord(id, {
      type: formData.type,
      comment: formData.comment,
      state: 1,
    })
    if (res.status) {
      Message.success('流程已结束')
    } else {
      Message.error('流程未成功结束')
    }
    return !!res.status
  }
  const onTransfer = async (formData: IRecordsProps): Promise<boolean | void> => {
    const res = await editRecord(id, {
      type: formData.type,
      comment: formData.comment,
      viewerId: formData.viewerId,
    })
    if (res.status) {
      Message.success('流程已经修改成功')
    } else {
      Message.error('流程未成功修改')
    }
    return !!res.status
  }
  const renderOption = {
    onAgree,
    onRefuse,
    onTransfer,
  }
  return (
    <div className="InterviewDetail-page">
      {/* Step form */}
      <FlowForm dataSource={initData} {...renderOption} />
    </div>
  )
}
