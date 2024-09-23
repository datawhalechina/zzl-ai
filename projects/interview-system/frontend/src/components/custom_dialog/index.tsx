import React from 'react'
import { Button, Dialog } from '@alifd/next'

import { QuickShowConfig } from '@alifd/next/types/dialog'
// https://ice.work/component/dialog

interface IBaseProps extends Partial<QuickShowConfig> {
  okName?: string;
  cancelName?: string;
  [key: string]: unknown;
}

const BaseDialog: React.SFC<IBaseProps> = (props: IBaseProps): React.Element => {
  const {
    title = '请确认',
    content = '是否要继续',
    okName = '确认',
    cancelName = '取消',
    visible,
    onOk,
    onCancel,
    onClose,
  } = props
  const footer = (
    <Button.Group size="small">
      {okName ? (
        <Button
          type="primary"
          onClick={() => {
            onOk && onOk()
          }}
          aria-label="ok"
          style={{ marginRight: '10px' }}
        >
          {okName}
        </Button>
      ) : null}
      {cancelName ? (
        <Button
          type="normal"
          onClick={() => {
            onCancel && onCancel()
          }}
          aria-label="cancel"
        >
          {cancelName}
        </Button>
      ) : null}
    </Button.Group>
  )
  return (
    <Dialog title={title} visible={visible} footer={footer} onClose={onClose}>
      {content}
    </Dialog>
  )
}

export default BaseDialog
