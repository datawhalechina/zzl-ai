import React from 'react'
import { Button, Form, Table, Dialog, Input, Message, Divider, Select, Icon } from '@alifd/next'
import FilterTable, { IGetDataFormParams, IGetDataPageParams } from '@/components/filter_table'
import DialogTable, { IDialogState, IDialogFnParam, tranActionType } from '@/components/dialog_table'
import {
  IUserProps,
  addUser,
  editUser,
  deleteUser,
  getAllUsersWithPage,
  EUserRoleType,
  unlockUser,
  lockUser,
} from '@/services/User'
import { useSetState } from 'ahooks'
import { DEFAULT_SELECT_RENDER_OPTION, formatSelectOption, formItemLayout } from '@/components/form_Item'
import FontRender from '@/components/font_render'

const FormItem = Form.Item

const getTableData = async ({ current, pageSize }: IGetDataPageParams, formData: IGetDataFormParams): Promise<any> => {
  if (!formData.status || formData.status === 'normal') {
    const res = (await getAllUsersWithPage({ pageNo: current, pageSize, ...formData })).data || []
    return { list: res.data, total: res.count }
  }
}

const renderLocked = (v: number) => {
  return v ? <FontRender type="warning" content={<Icon type="lock" />} /> : ''
}

const tableColumnContent = [
  <Table.Column key="lockUntil" title="上锁" width={60} dataIndex="lockUntil" cell={(v: number) => renderLocked(v)} />,
  <Table.Column key="name" title="名称" dataIndex="name" />,
  <Table.Column key="phone" title="手机号" dataIndex="phone" />,
  <Table.Column key="roleType" title="角色类型" dataIndex="roleType" cell={(v: number) => EUserRoleType[v]} />,
  <Table.Column key="buName" title="部门名称" dataIndex="buName" />,
]

const UserTable: React.SFC = (props): React.SFC => {
  const { dataSource = {} } = props
  const { bu = [], roleList = [] } = dataSource
  const buOptionList = formatSelectOption(bu, false)
  const roleOptionList = formatSelectOption(roleList, false)

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
        reset: (): void => { },
        submit: (): void => { },
      })

  const deleteConfirm = (data, reset): void => {
    Dialog.confirm({
      title: '删除提醒',
      content: `确定要删除${data.name || '选中'}用户?`,
      onOk: async () => {
        const res = await deleteUser(data.id)
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
  const handleOk = async ({ passwd, rePasswd, ...data }: IUserProps): Promise<boolean | void> => {
    if (!data || dialogConfig.actionType === 'preview') {
      handleCancel()
      return
    }
    const typeMessage = tranActionType(dialogConfig.actionType)

    const password = passwd !== '' ? passwd : undefined
    const currData = { ...data, password }
    const res = dialogConfig.actionType === 'edit' ? await editUser(data.id, currData) : await addUser(currData)
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
  const checkPass = (field, rule, value, callback) => {
    const { validate } = field
    validate(['rePasswd'])
    callback && callback()
  }

  const checkPass2 = (field, rule, value, callback) => {
    const { getValue } = field
    const passwd = getValue('passwd')
    if (!passwd) {
      return callback && callback()
    }
    if (value !== getValue('passwd')) {
      return callback && callback('请确认两次输入的密码一致')
    } else {
      return callback && callback()
    }
  }
  const formContent = (
    <>
      <FormItem {...formItemLayout.half} label="名称">
        <Input name="name" />
      </FormItem>
      <FormItem {...formItemLayout.half} format="tel" label="手机号">
        <Input name="phone" />
      </FormItem>
      <FormItem {...formItemLayout.half} label="角色类型：">
        <Select
          dataSource={roleOptionList}
          aria-label="roleType is"
          {...DEFAULT_SELECT_RENDER_OPTION}
          name="roleType"
        />
      </FormItem>
      <FormItem {...formItemLayout.half} label="部门名称：">
        <Select dataSource={buOptionList} aria-label="buName is" {...DEFAULT_SELECT_RENDER_OPTION} name="buId" />
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
  const handleEdit = (data: IUserProps, { }: IDialogFnParam): void => {
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
  const handlePreview = (data: IUserProps, { }: IDialogFnParam): void => {
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
  const handleLocked = async (data: IUserProps, needLocked, { reset }: IDialogFnParam): Promise<void> => {
    if (!data || !data.id) {
      return
    }
    const res = !needLocked ? await unlockUser(data.id) : await lockUser(data.id)
    const tipMessage = needLocked ? '上锁' : '解锁'
    if (res.status) {
      Message.success(`${tipMessage} 成功!`)
      reset()
    } else {
      Message.warning(`${tipMessage} 失败!`)
    }
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
        {record.lockUntil ? (
          <FilterTable.UnlockBtn handle={() => handleLocked(record, false, { submit, reset, dataSource })} />
        ) : (
          <FilterTable.LockBtn handle={() => handleLocked(record, true, { submit, reset, dataSource })} />
        )}  
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
  const childrenFn = (field) => {
    return (
      <>
        {dialogConfig.isPreview && (
          <FormItem label="用户主键:">
            <Input name="id" />
          </FormItem>
        )}
        <FormItem label="名称" required={!dialogConfig.isPreview} requiredMessage="必填" hasFeedback>
          <Input name="name" />
        </FormItem>
        <FormItem label="手机号" format="tel" required={!dialogConfig.isPreview} requiredMessage="必填" hasFeedback>
          <Input name="phone" />
        </FormItem>
        <FormItem label="角色类型：">
          <Select
            dataSource={roleOptionList}
            aria-label="roleType is"
            {...DEFAULT_SELECT_RENDER_OPTION}
            name="roleType"
          />
        </FormItem>
        <FormItem label="部门名称：" required={!dialogConfig.isPreview} requiredMessage="必填">
          <Select dataSource={buOptionList} aria-label="buName is" {...DEFAULT_SELECT_RENDER_OPTION} name="buId" />
        </FormItem>
        {['edit', 'add'].includes(dialogConfig.actionType) && (
          <FormItem
            label="密码:"
            hasFeedback
            required={dialogConfig.actionType === 'add'}
            requiredMessage="必填"
            validator={(rule, value, callback) => checkPass(field, rule, value, callback)}
          >
            <Input htmlType="password" placeholder="请输入密码" name="passwd" />
          </FormItem>
        )}

        {['edit', 'add'].includes(dialogConfig.actionType) && (
          <FormItem
            label="确认密码:"
            hasFeedback
            required={dialogConfig.actionType === 'add'}
            validator={(rule, value, callback) => checkPass2(field, rule, value, callback)}
          >
            <Input htmlType="password" placeholder="确认密码" name="rePasswd" />
          </FormItem>
        )}
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
      </>
    )
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
        childrenFn={childrenFn}
      />
    </div>
  )
}
export default UserTable
