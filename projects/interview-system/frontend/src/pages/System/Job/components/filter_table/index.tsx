import React from 'react'
import { Button, Form, Table, Dialog, Input, Message, Divider, Select, Icon } from '@alifd/next'
import FilterTable, { IGetDataFormParams, IGetDataPageParams } from '@/components/filter_table'
import DialogTable, { IDialogState, IDialogFnParam, tranActionType } from '@/components/dialog_table'
import { IJobsProps, addJob, getAllJobsWithPage, editJob, deleteJob } from '@/services/Jobs'
import { useSetState } from 'ahooks'
import { DEFAULT_SELECT_RENDER_OPTION, formatSelectOption, formItemLayout } from '@/components/form_Item'
import FontRender from '@/components/font_render'

const FormItem = Form.Item

const getTableData = async ({ current, pageSize }: IGetDataPageParams, formData: IGetDataFormParams): Promise<any> => {
  if (!formData.status || formData.status === 'normal') {
    const res = (await getAllJobsWithPage({ pageNo: current, pageSize, ...formData })).data || []
    return { list: res.data, total: res.count }
  }
}

const renderStatus = (v: number) => {
  return v ? (
    <FontRender type="success" content={<Icon type="success" />} />
  ) : (
    <FontRender type="warning" content={<Icon type="cry" />} />
  )
}
const tableColumnContent = [
  <Table.Column key="buName" title="部门名称" dataIndex="buName" />,
  <Table.Column key="functionName" title="职位名称" dataIndex="functionName" />,
  <Table.Column key="name" title="名称" dataIndex="name" />,
  <Table.Column key="state" title="状态" dataIndex="state" cell={(v: number) => renderStatus(v)} />,
]

const JobTable: React.SFC = (props): React.SFC => {
  const { dataSource = {} } = props
  const { fn = [], bu = [] } = dataSource
  const fnOptionList = formatSelectOption(fn, false)
  const buOptionList = formatSelectOption(bu, false)
  const [dialogConfig, setDialogConfig] = useSetState<IDialogState>({
    optCol: {},
    actionType: 'preview',
    actionVisible: false,
    isPreview: true,
  })
  const [selectedConfig, setSelectedConfig] = useSetState<{
    selected: number[];
    reset: () => void;
    submit: () => void;
  }>({
        selected: [],
        reset: (): void => {},
        submit: (): void => {},
      })

  const deleteConfirm = (data, reset): void => {
    Dialog.confirm({
      title: '删除提醒',
      content: `确定要删除${data.name || '选中'}职位?`,
      onOk: async () => {
        const res = await deleteJob(data.id)
        const tipMessage = data.name || res.msg
        if (res.status) {
          Message.success(`${tipMessage} 删除成功!`)
          reset()
        } else {
          Message.warning(`${tipMessage} 删除失败!`)
        }
      },
    })
  }

  const handleAdd = async (): Promise<void> => {
    setDialogConfig({
      optCol: {},
      actionType: 'add',
      actionVisible: true,
      isPreview: false,
    })
  }
  const handleOk = async (data: IJobsProps): Promise<boolean | void> => {
    if (!data || dialogConfig.actionType === 'preview') {
      handleCancel()
      return
    }
    const typeMessage = tranActionType(dialogConfig.actionType)
    const res = dialogConfig.actionType === 'edit' ? await editJob(data.id, data) : await addJob(data)
    if (res.status) {
      Message.success(`${data.name} ${typeMessage}成功!`)
      handleCancel()
    } else {
      Message.warning(`${data.name}  ${typeMessage}失败!`)
    }
    return res.status
  }

  const batchDelete = (): void => {
    if (!selectedConfig.selected.length) {
      return
    }
    deleteConfirm({ id: selectedConfig.selected.toString() }, selectedConfig.reset)
    setSelectedConfig({ selected: [] })
  }

  const formContent = (
    <>
      <FormItem {...formItemLayout.half} label="职位名称">
        <Input name="name" />
      </FormItem>
      <FormItem {...formItemLayout.half} label="部门名称：">
        <Select dataSource={buOptionList} aria-label="buName is" {...DEFAULT_SELECT_RENDER_OPTION} name="buId" />
      </FormItem>
      <FormItem {...formItemLayout.half} label="岗位名称：">
        <Select
          dataSource={fnOptionList}
          aria-label="functionName is"
          {...DEFAULT_SELECT_RENDER_OPTION}
          name="functionId"
        />
      </FormItem>
      <FormItem {...formItemLayout.half} label="状态">
        <Select name="state">
          <Select.Option value={0}>禁用</Select.Option>
          <Select.Option value={1}>启用</Select.Option>
        </Select>
      </FormItem>
      <FormItem colSpan={1}>
        <Button type="secondary" size="large" onClick={handleAdd}>
          新增
        </Button>
      </FormItem>
      <FormItem colSpan={1}>
        <Button type="normal" warning size="large" onClick={batchDelete}>
          批量删除
        </Button>
      </FormItem>
    </>
  )

  const handleDelete = (data: IJobsProps, { reset }: IDialogFnParam): void => {
    if (!data || !data.id) {
      return
    }
    deleteConfirm(data, reset)
  }

  const handleEdit = (data: IJobsProps, { }: IDialogFnParam): void => {
    if (!data || !data.id) {
      return
    }
    setDialogConfig({
      optCol: data,
      actionType: 'edit',
      actionVisible: true,
      isPreview: false,
    })
  }
  const handlePreview = (data: IJobsProps, { }: IDialogFnParam): void => {
    if (!data || !data.id) {
      return
    }
    setDialogConfig({
      optCol: data,
      actionType: 'preview',
      actionVisible: true,
      isPreview: true,
    })
  }
  const handleCancel = (): void => {
    setDialogConfig({
      actionVisible: false,
    })
  }
  const cellOperation = ({ submit, reset, dataSource }, ...args) => {
    const record = args[2]

    return (
      <div>
        <FilterTable.PreviewBtn handle={() => handlePreview(record, { submit, reset, dataSource })} />
        <Divider direction="ver" />
        <FilterTable.EditBtn handle={() => handleEdit(record, { submit, reset, dataSource })} />
        <Divider direction="ver" />
        <FilterTable.DeleteBtn handle={() => handleDelete(record, { submit, reset, dataSource })} />
      </div>
    )
  }
  const filterProp = {
    formConfig: {
      content: formContent,
    },
    tableConfig: {
      other: {
        // needPagination: false,
        needIndex: true,
        rowSelectionFn(_selectedKeys: number[], { submit, reset }) {
          setSelectedConfig({
            selected: _selectedKeys,
            reset,
            submit,
          })
        },
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
        visible={dialogConfig.actionVisible}
        actionType={dialogConfig.actionType}
        dataSource={dialogConfig.optCol}
        onOk={handleOk}
        onClose={handleCancel}
        onCancel={handleCancel}
        formComfig={{ responsive: true }}
      >
        {dialogConfig.isPreview && (
          <FormItem label="职位主键:" {...formItemLayout.full}>
            <Input name="id" />
          </FormItem>
        )}
        {dialogConfig.isPreview && (
          <FormItem label="创建人:" {...formItemLayout.full}>
            <Input name="userName" />
          </FormItem>
        )}
        <FormItem label="部门名称：" required={!dialogConfig.isPreview} requiredMessage="必填" {...formItemLayout.full}>
          <Select dataSource={buOptionList} aria-label="buName is" {...DEFAULT_SELECT_RENDER_OPTION} name="buId" />
        </FormItem>
        <FormItem label="岗位名称：" required={!dialogConfig.isPreview} requiredMessage="必填" {...formItemLayout.full}>
          <Select
            dataSource={fnOptionList}
            aria-label="functionName is"
            {...DEFAULT_SELECT_RENDER_OPTION}
            name="functionId"
          />
        </FormItem>
        <FormItem label="职位名称:" required={!dialogConfig.isPreview} requiredMessage="必填" {...formItemLayout.full}>
          <Input name="name" />
        </FormItem>
        <FormItem label="职位职责:" required={!dialogConfig.isPreview} requiredMessage="必填" {...formItemLayout.full}>
          <Input.TextArea name="responsibility" />
        </FormItem>
        <FormItem label="职位描述:" required={!dialogConfig.isPreview} requiredMessage="必填" {...formItemLayout.full}>
          <Input.TextArea name="description" />
        </FormItem>
        {dialogConfig.isPreview && (
          <FormItem label="启用状态:" {...formItemLayout.full}>
            <Select name="state" defaultValue={1} {...DEFAULT_SELECT_RENDER_OPTION}>
              <Select.Option value={0}>禁用</Select.Option>
              <Select.Option value={1}>启用</Select.Option>
            </Select>
          </FormItem>
        )}
        {dialogConfig.isPreview && (
          <FormItem label="创建时间:" {...formItemLayout.full}>
            <Input name="createdAt" />
          </FormItem>
        )}
        {dialogConfig.isPreview && (
          <FormItem label="更新时间:" {...formItemLayout.full}>
            <Input name="updatedAt" />
          </FormItem>
        )}
      </DialogTable>
    </div>
  )
}
export default JobTable
