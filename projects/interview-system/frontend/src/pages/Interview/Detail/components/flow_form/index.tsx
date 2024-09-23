import React, { SFC, useState, useEffect } from 'react'
import { Box, Button, Card, Form, Input, Field, Step, Select, Radio, ResponsiveGrid, Divider } from '@alifd/next'
import store from '@/store'
import styles from './index.module.scss'
import FixedBottom from '@/components/fixed_bottom'
import DialogTable, { IDialogState } from '@/components/dialog_table'
import {
  DEFAULT_SELECT_RENDER_OPTION,
  formatSelectOptionByFn,
  formItemLayout,
} from '@/components/form_Item'
import { renderPdfPreview } from '@/pages/components/resume_form/util'
import { withRouter } from 'ice'
import { useSetState } from 'ahooks'
import SuccessDetail, { ISuccessDetailProps } from '@/components/success_detail'
// import { formatUserByBu } from '@/services/User'

const FormItem = Form.Item

export interface FlowFormProps {
  dataSource?: any;
  onAgree?: () => void;
  onRefuse?: () => void;
  onTransfer?: () => void;
}

type FlowType = 'add' | 'preview' | 'edit'

const FlowForm: SFC<FlowFormProps> = (props) => {
  const { history, dataSource, onAgree = () => { }, onRefuse = () => { }, onTransfer = () => { } } = props

  // const history = useHistory()
  // 通过面试流程 id 进来之后，
  // 先获取当前流程的步骤进度
  // 先获取当前流程所有
  const { interviewee = {}, intervieweeStep = [], id, users = [], status = [], type = [], isLast, LAST_STEP_NAME } =
    dataSource || {}
  const currStep = Number(interviewee.step)
  const usersOptionList = formatSelectOptionByFn(users, (item) => [
    `${item.buName}/${item.name}`,
    `${item.id}|${item.name}`,
  ])
  const statusOptionList = formatSelectOptionByFn(status, (item) =>
    (item.name !== interviewee.stepName ? [item.name, item.name] : ''))
  const typeOptionList = formatSelectOptionByFn(type, (item) => [item.name, item.name])
  const MAX_STEP = status.length
  const [stepType, setStepType] = useState<keyof FlowType>('preview')
  const field = Field.useField({})
  useEffect(() => {
    field.reset()
    field.setValues(interviewee)
    setStepType(isLast || interviewee.stepName === LAST_STEP_NAME || interviewee.comment ? 'preview' : 'add')
  }, [interviewee, isLast, LAST_STEP_NAME, field])

  const [user] = store.useModel('user')
  const [dialogConfig, setDialogConfig] = useSetState<IDialogState>({
    optCol: {},
    actionType: 'preview',
    actionVisible: false,
    isPreview: false,
  })
  const handleFlow = async (dialogType: 'add' | 'tran' | 'reject' | 'edit') => {
    if (dialogType === 'edit') {
      setStepType('edit')
      return
    }
    const { errors } = await field.validatePromise()
    if (errors) {
      return
    }
    const formData = field.getValues()
    switch (dialogType) {
      case 'add': {
        setDialogConfig({
          actionType: 'add',
          actionVisible: true,
        })
        break
      }
      case 'reject': {
        const res = await onRefuse(formData)
        res && setStepType('preview')
        break
      }
      case 'tran': {
        const res = await onTransfer(formData)
        res && jumpFlowByStep(id)
        break
      }
      default: {
        break
      }
    }
  }
  const jumpFlowByStep = (flowId: number): void => {
    flowId !== undefined && window.top.location.replace(`/interview/process/${Number(flowId)}`)
    // flowId !== undefined && history.push(`/interview/process/${Number(flowId)}`)
  }

  // let actions: React.Element
  const getFlowTookit = (tookitType: FlowType): React.Element => {
    const AggreBtn = () => (
      <Button onClick={() => handleFlow('add')} type="primary" disabled={!!interviewee.status}>
        同意
      </Button>
    )
    const RejectBtn = () => (
      <Button onClick={() => handleFlow('reject')} type="primary" warning disabled={!!interviewee.status}>
        拒绝
      </Button>
    )
    // const TranBtn = () => <Button onClick={() => handleFlow('tran')} type="secondary" >加签</Button>
    const EditBtn = () => (
      <Button onClick={() => handleFlow('edit')} type="primary">
        编辑
      </Button>
    )
    const ModifyBtn = () => (
      <Button onClick={() => handleFlow('tran')} type="normal">
        修改
      </Button>
    )
    if (!tookitType || isLast) {
      return (
        <>
          <Button onClick={() => history.push('/interview/list')} type="primary">
            返回列表
          </Button>
        </>
      )
    }
    let actions: React.Element
    switch (tookitType) {
      case 'add': {
        actions = (
          <>
            <AggreBtn />
            <RejectBtn />
            {/* <TranBtn /> */}
          </>
        )
        break
      }
      case 'preview': {
        actions = (
          <>
            <EditBtn />
          </>
        )
        break
      }
      case 'edit': {
        actions = (
          <>
            <AggreBtn />
            <RejectBtn />
            <ModifyBtn />
          </>
        )
        break
      }
      default: {
        actions = () => (
          <>
            <EditBtn />
          </>
        )
        break
      }
    }
    return actions
  }
  const handleCancel = (): void => {
    setDialogConfig({
      actionVisible: false,
    })
  }
  const handleOk = async (data): Promise<boolean | void> => {
    if (!data || dialogConfig.actionType === 'preview') {
      handleCancel()
      return
    }

    const formData = field.getValues()
    const res = await onAgree(formData, data)
    const nextStep = currStep + 1
    res && nextStep <= MAX_STEP && jumpFlowByStep(Number(id) + 1)
  }
  const getCardItemOption = (idx, intervieweeItem, arr) => {
    return idx === arr.length - 1 ? { field } : { value: intervieweeItem }
  }
  const getSuccessDetailByItem = (): ISuccessDetailProps => ({
    statusCode: '已经入职',
    countDownSecnods: 0,
  })
  return (
    <Box spacing={20} className={styles.FlowForm}>
      <>
      <Card free>
        <Card.Content>
          <Step current={currStep - 1} animation labelPlacement="hoz">
            {intervieweeStep.map((item) => (
              <Step.Item key={item.step} title={item.stepName} onClick={() => jumpFlowByStep(item.id)} />
            ))}
          </Step>
        </Card.Content>
      </Card>
      <Card free>
        <Card.Header title="候选人信息" />
        <Card.Divider />
        <Card.Content>
          <ResponsiveGrid>
            <ResponsiveGrid.Cell colSpan={6}>
              <Form labelAlign="left" responsive isPreview value={interviewee}>
                <Form.Item label={`${interviewee.intervieweeName} | ${interviewee.education}`} {...formItemLayout.full}>
                  <span className="next-form-preview">
                    {interviewee.intervieweeTel} | {interviewee.intervieweeEmail}
                  </span>
                </Form.Item>
                <Form.Item label="现在所在地" {...formItemLayout.full}>
                  <span className="next-form-preview">{interviewee.address}</span>
                </Form.Item>
                <Form.Item label="教育经验" {...formItemLayout.full}>
                  <Input name="intervieweeType" />
                </Form.Item>
              </Form>
            </ResponsiveGrid.Cell>
            <ResponsiveGrid.Cell colSpan={6} style={{ position: 'relative' }}>
              <Divider className={styles.Divider} direction="ver" />
              <Form labelAlign="left" responsive isPreview value={interviewee} field={field}>
                <Form.Item label="推荐理由" {...formItemLayout.full}>
                  <Input name="reason" />
                </Form.Item>
                <Form.Item label="推荐渠道" {...formItemLayout.half}>
                  <Input name="channel" />
                </Form.Item>
                <Form.Item label="简历查看" {...formItemLayout.half}>
                  <div>{renderPdfPreview(interviewee.resumePath)}</div>
                </Form.Item>
                <Form.Item label="推荐备注" {...formItemLayout.full}>
                  <Input name="intervieweeNote" />
                </Form.Item>
              </Form>
            </ResponsiveGrid.Cell>
          </ResponsiveGrid>
        </Card.Content>
      </Card>
      {intervieweeStep
        .filter((intervieweeItem) => intervieweeItem.step <= interviewee.step)
        .map((intervieweeItem, idx, arr) =>
          (intervieweeItem.stepName !== LAST_STEP_NAME ? (
            <Card free key={`${intervieweeItem.id}-${String.fromCharCode(97 + Number(idx))}`}>
              <Card.Header title={`${intervieweeItem.stepName}-审批信息`} />
              <Card.Divider />
              <Card.Content>
                <Form
                  labelAlign="top"
                  fullWidth
                  {...getCardItemOption(idx, intervieweeItem, arr)}
                  responsive
                  isPreview={idx !== arr.length - 1 || stepType === 'preview'}
                >
                  <Form.Item label="审批人" {...formItemLayout.less} isPreview>
                    <Select
                      name="viewer"
                      dataSource={usersOptionList}
                      value={`${user.buName}/${user.name}`}
                      {...DEFAULT_SELECT_RENDER_OPTION}
                    />
                  </Form.Item>
                  <FormItem label="面试日期" {...formItemLayout.less} isPreview>
                    <Input name="updatedAt" />
                  </FormItem>
                  <Form.Item label="面试方式" {...formItemLayout.full} required>
                    <Radio.Group dataSource={typeOptionList} name="type" defaultValue={1} />
                  </Form.Item>
                  <Form.Item label="意见&反馈" {...formItemLayout.full} required>
                    <Input.TextArea maxLength={500} name="comment" hasLimitHint placeholder="请输入描述" />
                  </Form.Item>
                </Form>
              </Card.Content>
            </Card>
          ) : (
            <Card free key={`${intervieweeItem.id}-${String.fromCharCode(97 + Number(idx))}`}>
              <Card.Header title={`${intervieweeItem.stepName}`} />
              <Card.Divider />
              <Card.Content>
                <SuccessDetail {...getSuccessDetailByItem()} />
              </Card.Content>
            </Card>
          )))}
    
      <FixedBottom>
        <Box direction="row" spacing={8} align="center" justify="center">
          {getFlowTookit(stepType)}
        </Box>
      </FixedBottom>
      {/* <DialogTable
        title="指派"
        visible={dialogConfig.actionVisible}
        actionType={dialogConfig.actionType}
        dataSource={dialogConfig.optCol}
        onOk={handleOk}
        onClose={handleCancel}
        onCancel={handleCancel}
      >
        <>
          <FormItem required={!dialogConfig.isPreview} requiredMessage="必填" label="下一轮面试官">
            <Select name="viewer" dataSource={usersOptionList} {...DEFAULT_SELECT_RENDER_OPTION} />
          </FormItem>
          <FormItem required={!dialogConfig.isPreview} requiredMessage="必填" label="面试环节">
            <Select name="stepName" dataSource={statusOptionList} {...DEFAULT_SELECT_RENDER_OPTION} />
          </FormItem>
        </>
      </DialogTable> */}
      </>
    </Box>
   
  )
}

export default withRouter(FlowForm)
