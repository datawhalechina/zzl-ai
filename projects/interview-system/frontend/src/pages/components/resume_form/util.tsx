import React from 'react'
import FontRender from '@/components/font_render'
import { IDicItemProps } from '@/services/Dicitem'
import { IFunctionProps } from '@/services/Function'
import { EINTERVIEWEE_TYPE } from '@/services/Interviewee'
import { Button, Icon } from '@alifd/next'

export interface ResumeFormProps {
  dataSource?: {
    fn: IFunctionProps[];
    resume: IDicItemProps[];
  };
}
export const renderIsSuccess = (v: number) => {
  return v ? (
    <FontRender type="success" content={<Icon type="success" />} />
  ) : (
    <FontRender type="warning" content={<Icon type="cry" />} />
  )
}
export const openPdfPreview = (url: string): void => {
  window && window.open(`/api/${url}`, '_blank')
}
export const renderPdfPreview = (v: string) => {
  return (
    v && (
      <Button
        text
        onClick={() => {
          openPdfPreview(v)
        }}
      >
        {' '}
        <FontRender type="success" content={<Icon type="eye" />} />
      </Button>
    )
  )
}

export const renderStatus = (v: string, isSuccess = true) => {
  const currStatus = v === '' ? '还未开始面试' : `已经开始${v}面试`
  const content = v === '' ? '' : <Icon type="clock" />
  return !isSuccess ? (
    <FontRender title={`当前候选人${currStatus}`} type="warning" content={content} />
  ) : (
    <FontRender title="已经入职" type="success" content={<Icon type="success" />} />
  )
}

export const renderType = (v: string) => {
  return EINTERVIEWEE_TYPE[v]
}
