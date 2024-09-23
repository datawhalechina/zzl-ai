import React, { useEffect } from 'react'
import { Dialog, Field, Form } from '@alifd/next'
import { DialogProps } from '@alifd/next/types/dialog'
import { useDebounceFn } from 'ahooks'

export interface IOperaitionProps {
  formComfig?: object;
  visible?: boolean;
  getDialogTitle?: () => string;
  actionType?: string;
  title?: string;
  dataSource?: object;
  onOk?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
  onChange?: () => void;
  childrenFn?: () => React.Element;
}
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
}
export type ActionType = 'add' | 'edit' | 'preview' | 'config'

export interface IDialogState {
  optCol: any;
  actionType: ActionType;
  actionVisible: boolean;
  isPreview?: boolean;
  other?: object;
  [name: string]: any;
}
export interface IDialogFnParam {
  submit?: () => void;
  reset?: () => void;
  dataSource?: {
    [name: string]: unknown;
  };
}
export const tranActionType = (actionType: ActionType): string => {
  switch (actionType) {
    case 'add':
    default:
      return '添加'
    case 'edit':
      return '编辑'
    case 'preview':
      return '详情'
    case 'config':
      return '配置'
  }
}
const DEFAULT_WAIT = { wait: 500 }

const DialogOperation: React.FC<IOperaitionProps & DialogProps> = (props) => {
  const {
    actionType,
    title,
    visible,
    dataSource,
    onOk = () => {},
    onClose,
    onCancel = () => {},
    onChange = () => {},
    getDialogTitle = tranActionType,
    children,
    childrenFn,
    formComfig = {},
    ...otherProps
  } = props

  const field = Field.useField({ onChange, values: dataSource })

  useEffect(() => {
    field.reset()
    dataSource && field.setValues(dataSource)
  }, [visible, field, dataSource])

  const { run: handleOk } = useDebounceFn(async (): Promise<void> => {
    if (actionType === 'preview') {
      return onOk(null)
    }
    const { errors } = await field.validatePromise()
    if (errors) {
      return
    }
    const currRes = field.getValues()
    const execRight = await onOk(currRes)
    if (execRight) {
      const resetBtnDom = document.getElementById('js-reset-table')
      resetBtnDom?.click()
    }
  }, DEFAULT_WAIT)

  const isPreview = actionType === 'preview'

  return (
    <Dialog
      shouldUpdatePosition
      title={title || getDialogTitle(actionType)}
      style={{ width: 600 }}
      footerAlign="center"
      {...otherProps}
      visible={visible}
      onOk={handleOk}
      onClose={onCancel}
      onCancel={onClose || onCancel}
    >
      <Form
        isPreview={isPreview}
        fullWidth
        labelAlign={isPreview ? 'left' : 'top'}
        field={field}
        {...formItemLayout}
        {...formComfig}
      >
        {childrenFn ? childrenFn(field) : children}
      </Form>
    </Dialog>
  )
}

export default DialogOperation
