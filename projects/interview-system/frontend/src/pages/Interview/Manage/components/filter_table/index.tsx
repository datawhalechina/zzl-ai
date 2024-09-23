import React from 'react'
import { Button, Form, Table, Input, Icon, Select, DatePicker } from '@alifd/next'
import FilterTable, { IGetDataPageParams } from '@/components/filter_table'
import { IRecordsProps, getAllRecordsWithPage } from '@/services/interviewee_record'
import { DEFAULT_SELECT_RENDER_OPTION, formatSelectOptionByFn, formItemLayout } from '@/components/form_Item'
import { renderPdfPreview, renderStatus } from '@/pages/components/resume_form/util'
import { withRouter } from 'ice'
import FontRender from '@/components/font_render'

const FormItem = Form.Item

const getTableData = async ({ current, pageSize }: IGetDataPageParams, formData: IRecordsProps): Promise<any> => {
  if (!status || status === 'normal') {
    const res = (await getAllRecordsWithPage({ pageNo: current, pageSize, ...formData })).data || []
    return { list: res.data, total: res.count }
  }
}

const renderIsSuccess = (v: number) => {
  return <FontRender type={v ? 'success' : 'error'} content={<Icon type="smile" />} />
}

const tableColumnContent = [
  <Table.Column
    title="面试状态"
    cell={(v: string, idx: number, data) => renderStatus(v, data.isSuccess)}
    key="stepName"
    dataIndex="stepName"
  />,
  <Table.Column title="推荐状态" cell={(v: number) => renderIsSuccess(v)} key="isSuccess" dataIndex="isSuccess" />,
  <Table.Column title="推荐日期" key="createdAt" dataIndex="createdAt" />,
  <Table.Column title="候选人姓名" key="intervieweeName" dataIndex="intervieweeName" />,
  <Table.Column title="面试步骤" key="step" dataIndex="step" />,
  <Table.Column title="面试环节" key="stepName" dataIndex="stepName" />,
  <Table.Column
    title="简历预览"
    cell={(v: string) => renderPdfPreview(v)}
    width={80}
    key="resumePath"
    dataIndex="resumePath"
  />,
]

const ResumeTable: React.SFC = (props): React.SFC => {
  const { history, dataSource = {} } = props
  const { interviewee = [], LAST_STEP_NAME = '' } = dataSource
  const intervieweeOptionList = formatSelectOptionByFn(interviewee, (item) => [item.name, item.name])
  const formContent = (
    <>
      <FormItem {...formItemLayout.less} label="候选人姓名">
        <Input name="intervieweeName" />
      </FormItem>
      <FormItem {...formItemLayout.less} label="面试流程">
        <Select
          key="stepName"
          name="stepName"
          mode="multiple"
          dataSource={intervieweeOptionList}
          {...DEFAULT_SELECT_RENDER_OPTION}
        />
      </FormItem>
      <FormItem {...formItemLayout.less} label="面试状态">
        <Select name="state" key="state" defaultValue={0} {...DEFAULT_SELECT_RENDER_OPTION}>
          <Select.Option value={0}>未结束</Select.Option>
          <Select.Option value={1}>已结束</Select.Option>
        </Select>
      </FormItem>
      <FormItem colSpan={6} label="创建日期">
        <DatePicker.RangePicker name="createdAt" showTime resetTime />
      </FormItem>
      <FormItem colSpan={6} label="面试日期">
        <DatePicker.RangePicker name="updatedAt" showTime resetTime />
      </FormItem>
    </>
  )

  const cellOperation = ({ }, ...args) => {
    const record = args[2]
    const btnName = record.comment || record.stepName === LAST_STEP_NAME ? '查看' : '面试'
    return (
      <div>
        <Button onClick={() => history.push(`/interview/process/${record.id}`)}>{btnName}</Button>
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
    </div>
  )
}
export default withRouter(ResumeTable)
