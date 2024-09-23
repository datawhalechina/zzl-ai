import React from 'react'
import { Form, Table, Dialog, Input, Message, Divider, Select, DatePicker, Checkbox } from '@alifd/next'
import FilterTable, { IGetDataFormParams, IGetDataPageParams } from '@/components/filter_table'
import DialogTable, { IDialogFnParam, IDialogState } from '@/components/dialog_table'
import { IIntervieweesProps, getAllIntervieweesWithPage } from '@/services/Interviewee'
import { addRecord } from '@/services/interviewee_record'
import { useSetState, useUpdateEffect } from 'ahooks'
import {
  DEFAULT_SELECT_RENDER_OPTION,
  formatSelectOption,
  formatSelectOptionByFn,
  formItemLayout,
  IOption,
} from '@/components/form_Item'
import { openPdfPreview, renderStatus, renderType } from '@/pages/components/resume_form/util'
import { withRouter } from 'ice'
import { formatUserByBu } from '@/services/User'

const FormItem = Form.Item

const getTableData = async (
  { current, pageSize }: IGetDataPageParams,
  { status, intervieweeStatus, needNew, ...formData }: IGetDataFormParams,
): Promise<any> => {
  if (!status || status === 'normal') {
    const reallyStatus = needNew ? '' : intervieweeStatus
    const res =
      (await getAllIntervieweesWithPage({ pageNo: current, pageSize, ...formData, status: reallyStatus })).data || []
    return { list: res.data, total: res.count }
  }
}

const tableColumnContent = [
  <Table.Column
    title="面试状态"
    cell={(v: string, idx: number, data) => renderStatus(v, data.isSuccess)}
    key="status"
    dataIndex="status"
  />,
  <Table.Column title="推荐日期" key="createdAt" dataIndex="createdAt" />,
  <Table.Column title="候选人姓名" key="name" dataIndex="name" />,
  <Table.Column title="推荐人名称" key="recommenderName" dataIndex="recommenderName" />,
  <Table.Column title="招聘类型" cell={(v: string) => renderType(v)} key="type" dataIndex="type" />,
  <Table.Column title="推荐岗位" key="jobName" dataIndex="jobName" />,
]

const ResumeTable: React.SFC = (props): React.SFC => {
  const { dataSource = {} } = props
  const [optionData, setOptionData] = useSetState<{
    buOptionList: IOption[];
    intervieweeOptionList: IOption[];
    resumeOptionList: IOption[];
    usersOptionList: IOption[];
    jobsOptionList: IOption[];
  }>({
    buOptionList: [],
    intervieweeOptionList: [],
    resumeOptionList: [],
    usersOptionList: [],
    jobsOptionList: [],
  })

  useUpdateEffect(() => {
    const { bu = [], interviewee = [], resume = [], users = [], jobs = [] } = dataSource
    setOptionData({
      buOptionList: formatSelectOption(bu, false),
      intervieweeOptionList: formatSelectOptionByFn(interviewee, (item) => [item.name, item.name]),
      resumeOptionList: formatSelectOption(resume, false),
      usersOptionList: formatSelectOptionByFn(users, formatUserByBu),
      jobsOptionList: formatSelectOption(jobs, false),
    })
  }, [dataSource])
  const [dialogConfig, setDialogConfig] = useSetState<IDialogState>({
    optCol: {},
    actionType: 'preview',
    actionVisible: false,
    isPreview: true,
    other: {
      viewerName: '',
      stepName: '',
    },
  })
  const selectStoreObj = {
    user: 'viewerName',
    step: 'stepName',
  }
  const assignConfirm = (data, reset): Promise<boolean | void> => {
    return new Promise((resolve) => {
      Dialog.confirm({
        title: '指派提醒',
        content: `确定要指派「${data.name || '选中'}」候选人指派给 「${dialogConfig.other.viewerName}」 进行 「${data.intervieweeStatus
        }」?`,
        onOk: async () => {
          const recordData = {
            viewerId: data.viewerId,
            viewerName: dialogConfig.other.viewerName,
            step: 0,
            stepName: data.intervieweeStatus,
            intervieweeId: data.id,
            intervieweeName: data.name,
          }
          const res = await addRecord(recordData)
          if (res.status) {
            Message.success(`${data.name || res.msg} 指派成功!`)
            reset()
          } else {
            Message.warning(`${res.msg}`)
          }
          resolve(res.status)
        },
      })
    })
  }
  const handleOk = async (data: IIntervieweesProps): Promise<boolean | void> => {
    if (!data || dialogConfig.actionType === 'preview') {
      handleCancel()
      return
    }
    if (dialogConfig.actionType === 'config') {
      return assignConfirm(data, handleCancel)
    }
  }
  const defaultSelectOption = formatSelectOptionByFn(['否', '是'], (item, idx) => [item, idx])
  const formContent = (
    <>
      <FormItem {...formItemLayout.less} label="推荐姓名">
        <Input name="name" />
      </FormItem>
      <FormItem {...formItemLayout.most} label="面试流程">
        <Select
          id="intervieweeStatus"
          key="intervieweeStatus"
          name="intervieweeStatus"
          mode="multiple"
          dataSource={optionData.intervieweeOptionList}
          {...DEFAULT_SELECT_RENDER_OPTION}
        />
      </FormItem>
      <FormItem {...formItemLayout.less} label="招聘渠道">
        <Select
          name="type"
          id="manageType"
          key="manageType"
          dataSource={optionData.resumeOptionList}
          {...DEFAULT_SELECT_RENDER_OPTION}
        />
      </FormItem>
      <FormItem {...formItemLayout.most} label="推荐日期">
        <DatePicker.RangePicker name="createdAt" showTime resetTime />
      </FormItem>
      <FormItem {...formItemLayout.less} label="是否实习">
        <Select name="isInternship" dataSource={defaultSelectOption} {...DEFAULT_SELECT_RENDER_OPTION} />
      </FormItem>
      <FormItem {...formItemLayout.less} label="推荐是否成功">
        <Select name="isSuccess" dataSource={defaultSelectOption} {...DEFAULT_SELECT_RENDER_OPTION} />
      </FormItem>
      <FormItem label="面试岗位" {...formItemLayout.less}>
        <Select
          name="jobId"
          dataSource={optionData.jobsOptionList}
          disabled={!!dialogConfig.optCol.jobId}
          {...DEFAULT_SELECT_RENDER_OPTION}
        />
      </FormItem>
      <FormItem {...formItemLayout.most}>
        <Checkbox name="needNew" defaultChecked>
          只看未安排候选人
        </Checkbox>
      </FormItem>
    </>
  )

  const handlePreview = (data: IIntervieweesProps, { }: IDialogFnParam): void => {
    if (!data || !data.id) {
      return
    }
    openPdfPreview(data.resumePath)
  }
  const handleAssign = (data: IIntervieweesProps, { }: IDialogFnParam): void => {
    if (!data || !data.id) {
      return
    }
    setDialogConfig({
      optCol: { ...data, intervieweeStatus: data.status },
      actionType: 'config',
      actionVisible: true,
      isPreview: false,
    })
  }
  const handleCancel = (): void => {
    setDialogConfig({
      other: { viewerName: '', stepName: '' },
      actionVisible: false,
    })
  }

  const handleDialogSelectChange = (type: 'user' | 'step' = 'user', { label }) => {
    const currlabel = label.indexOf('/') > -1 ? label.split('/')[1] : label
    setDialogConfig({ other: { ...dialogConfig.other, [selectStoreObj[type]]: currlabel } })
    // return value
  }
  const cellOperation = ({ }: IDialogFnParam, ...args) => {
    const record = args[2]

    return (
      <div>
        {!record.status && (
          <>
            <FilterTable.SettingBtn handle={() => handleAssign(record, {})} />
            <Divider direction="ver" />
          </>
        )}
        <FilterTable.PreviewBtn handle={() => handlePreview(record, {})} />
      </div>
    )
  }
  const filterProp = {
    formConfig: {
      content: formContent,
    },
    tableConfig: {
      other: {
        needIndex: false,
      },
      content: tableColumnContent,
    },
    getTableData,
    cellOperation,
    defaultParams: {
      pageSize: 10,
    },
    primaryKey: 'id',
  }
  return (
    <div>
      <FilterTable {...filterProp} />

      <DialogTable
        title="指派"
        visible={dialogConfig.actionVisible}
        actionType={dialogConfig.actionType}
        dataSource={dialogConfig.optCol}
        onOk={handleOk}
        onClose={handleCancel}
        onCancel={handleCancel}
      >
        <FormItem required={!dialogConfig.isPreview} requiredMessage="必填" label="面试官">
          <Select
            name="viewerId"
            dataSource={optionData.usersOptionList}
            onChange={(value, actionType, item) => handleDialogSelectChange('user', item)}
            {...DEFAULT_SELECT_RENDER_OPTION}
          />
        </FormItem>
        <FormItem required={!dialogConfig.isPreview} requiredMessage="必填" label="面试流程">
          <Input name="intervieweeStatus" value="一面" disabled />
        </FormItem>
        <FormItem style={{ display: 'none' }} label="面试官">
          <Input name="viewerName" />
        </FormItem>
        <FormItem required={!dialogConfig.isPreview} requiredMessage="必填" label="面试岗位">
          <Select
            name="jobId"
            dataSource={optionData.jobsOptionList}
            {...DEFAULT_SELECT_RENDER_OPTION}
            disabled={!!dialogConfig.optCol.jobId}
          />
        </FormItem>
      </DialogTable>
    </div>
  )
}
export default withRouter(ResumeTable)
