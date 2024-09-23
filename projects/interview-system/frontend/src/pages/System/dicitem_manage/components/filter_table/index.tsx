import React from 'react'
import { Button, Form, Table, Dialog, Input, Message, Divider, Icon, Select } from '@alifd/next'
import FilterTable, { IGetDataFormParams, IGetDataPageParams } from '@/components/filter_table'
import DialogTable, { IDialogState, IDialogFnParam, tranActionType } from '@/components/dialog_table'
import { IDicItemProps, addDic, editDic, deleteDic, getAllDicWithPage } from '@/services/Dicitem'
import { useSetState } from 'ahooks'
import FontRender from '@/components/font_render'
import { formItemLayout } from '@/components/form_Item'

const FormItem = Form.Item

const getTableData = async ({ current, pageSize }: IGetDataPageParams, formData: IGetDataFormParams): Promise<any> => {
  if (!formData.status || formData.status === 'normal') {
    const res = (await getAllDicWithPage({ pageNo: current, pageSize, ...formData })).data || []
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
  <Table.Column key="name" title="名称" dataIndex="name" />,
  <Table.Column key="value" title="值" dataIndex="value" />,
  <Table.Column key="note" title="分组备注" dataIndex="note" />,
  <Table.Column key="groupName" title="分组" dataIndex="groupName" />,
  <Table.Column key="enable" title="状态" dataIndex="enable" cell={(v: number) => renderStatus(v)} />,
]

const DicitemTable: React.SFC = (): React.SFC => {
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
        reset: (): void => { },
        submit: (): void => { },
      })

  const deleteConfirm = (data, reset): void => {
    Dialog.confirm({
      title: '删除提醒',
      content: `确定要删除${data.name || '选中'}字典项?`,
      onOk: async () => {
        const res = await deleteDic(data.id)
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

  const handleAdd = (): void => {
    setDialogConfig({
      optCol: {},
      actionType: 'add',
      actionVisible: true,
      isPreview: false,
    })
  }
  const handleOk = async (data: IDicItemProps): Promise<boolean | void> => {
    if (!data || dialogConfig.actionType === 'preview') {
      handleCancel()
      return
    }
    const typeMessage = tranActionType(dialogConfig.actionType)
    const res = dialogConfig.actionType === 'edit' ? await editDic(data.id, data) : await addDic(data)
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
      <FormItem {...formItemLayout.less} label="名称">
        <Input name="name" />
      </FormItem>
      <FormItem {...formItemLayout.less} label="字典值">
        <Input name="value" />
      </FormItem>
      <FormItem {...formItemLayout.less} label="分组备注">
        <Input name="note" />
      </FormItem>
      <FormItem {...formItemLayout.less} label="分组码">
        <Input name="groupName" />
      </FormItem>
      <FormItem {...formItemLayout.less} label="状态">
        <Select name="enable">
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

  const handleDelete = (data: IDicItemProps, { reset }: IDialogFnParam): void => {
    if (!data || !data.id) {
      return
    }
    deleteConfirm(data, reset)
  }

  const handleEdit = (data: IDicItemProps, { }: IDialogFnParam): void => {
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
  const handlePreview = (data: IDicItemProps, { }: IDialogFnParam): void => {
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
  const cellOperation = ({ submit, reset, dataSource }: IDialogFnParam, ...args) => {
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
      config: {
        wrapperCol: { span: 12, offset: 1 },
      },
      content: formContent,
    },
    tableConfig: {
      other: {
        needIndex: false,
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
      >
        <FormItem
          {...formItemLayout.less}
          label="名称"
          required={!dialogConfig.isPreview}
          requiredMessage="必填"
          hasFeedback
        >
          <Input name="name" />
        </FormItem>
        <FormItem
          {...formItemLayout.less}
          label="字典值"
          required={!dialogConfig.isPreview}
          requiredMessage="必填"
          hasFeedback
        >
          <Input name="value" />
        </FormItem>
        <FormItem
          {...formItemLayout.less}
          label="分组码"
          required={!dialogConfig.isPreview}
          requiredMessage="必填"
          pattern={/^[A-Za_]+$/}
          patternMessage="只支持大写字母和下划线"
          hasFeedback
        >
          <Input name="groupName" />
        </FormItem>
        <FormItem
          {...formItemLayout.less}
          label="分组备注"
          required={!dialogConfig.isPreview}
          requiredMessage="必填"
          hasFeedback
        >
          <Input name="note" />
        </FormItem>
        <FormItem {...formItemLayout.less} label="状态" required={!dialogConfig.isPreview} requiredMessage="必填">
          <Select name="enable" defaultValue={1}>
            <Select.Option value={0}>禁用</Select.Option>
            <Select.Option value={1}>启用</Select.Option>
          </Select>
        </FormItem>
        <FormItem
          {...formItemLayout.less}
          label="默认序号"
          required={!dialogConfig.isPreview}
          requiredMessage="必填"
          format="number"
          hasFeedback
        >
          <Input name="sortNum" defaultValue={dialogConfig.optCol.length} />
        </FormItem>
        {dialogConfig.isPreview && (
          <FormItem label="创建时间:">
            <Input name="createdAt" />
          </FormItem>
        )}
        {dialogConfig.isPreview && (
          <FormItem label="更新时间:">
            <Input name="updatedAt" />
          </FormItem>
        )}
      </DialogTable>
    </div>
  )
}
export default DicitemTable
