import React from 'react'
import { Button, Form, Table, Dialog, Input, Message, Divider } from '@alifd/next'
import FilterTable, { IGetDataFormParams, IGetDataPageParams } from '@/components/filter_table'
import DialogTable, { IDialogState, IDialogFnParam, tranActionType } from '@/components/dialog_table'
import { IBusProps, getAllBusWithPage, addBu, editBu, deleteBu } from '@/services/Bu'
import { useSetState } from 'ahooks'
import { formItemLayout } from '@/components/form_Item'

const FormItem = Form.Item

const getTableData = async ({ current, pageSize }: IGetDataPageParams, formData: IGetDataFormParams): Promise<any> => {
  if (!formData.status || formData.status === 'normal') {
    const res = (await getAllBusWithPage({ pageNo: current, pageSize, ...formData })).data || []
    return { list: res.data, total: res.count }
  }
}

const tableColumnContent = [<Table.Column key="name" title="名称" dataIndex="name" />]

const OrganizationTable: React.SFC = (): React.SFC => {
  const [dialogConfig, setDialogConfig] = useSetState<IDialogState>({
    optCol: null,
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
      content: `确定要删除${data.name || '选中'}部门?`,
      onOk: async () => {
        const res = await deleteBu(data.id)
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
  const handleOk = async (data: IBusProps): Promise<boolean | void> => {
    if (!data || dialogConfig.actionType === 'preview') {
      handleCancel()
      return
    }
    const typeMessage = tranActionType(dialogConfig.actionType)
    const res = dialogConfig.actionType === 'edit' ? await editBu(data.id, data) : await addBu(data)
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
      <FormItem {...formItemLayout.most} label="部门名称">
        <Input name="name" />
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

  const handleDelete = (data: IBusProps, { reset }: IDialogFnParam): void => {
    if (!data || !data.id) {
      return
    }
    deleteConfirm(data, reset)
  }

  const handleEdit = (data: IBusProps, { }: IDialogFnParam): void => {
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
  const handlePreview = (data: IBusProps, { }: IDialogFnParam): void => {
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
      >
        {dialogConfig.isPreview && (
          <FormItem label="部门主键:">
            <Input name="id" />
          </FormItem>
        )}
        <FormItem label="部门名称:" required={!dialogConfig.isPreview} requiredMessage="必填">
          <Input name="name" />
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
export default OrganizationTable
