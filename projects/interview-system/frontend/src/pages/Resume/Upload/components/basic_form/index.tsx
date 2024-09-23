import React, { useState, useRef, useCallback } from 'react'
import { Input, Form, Box, Button, Card, Message, Radio, Upload, Select } from '@alifd/next'

import styles from './index.module.scss'
import { DEFAULT_SELECT_RENDER_OPTION, formatSelectOption, formItemLayout } from '@/components/form_Item'
import { addInterviewee, IIntervieweesProps } from '@/services/Interviewee'
import { withRouter } from 'ice'
import { IResponseType } from '@/services/api'

import { IFunctionProps } from '@/services/Function'
import { IDicItemProps } from '@/services/Dicitem'
import { ItemProps } from '@alifd/next/types/form'
import BaseDialog from '@/components/custom_dialog'

import path from 'path'
import FixedBottom from '@/components/fixed_bottom'

const FormItem = Form.Item

export interface IBasicFormProps {
  dataSource?: {
    fn: IFunctionProps[];
    resume: IDicItemProps[];
  };
  onSubmit?: () => void;
  onCancel?: () => void;
}

const DEFAULT_DATA: IIntervieweesProps = {
  // type: 0,
  isInternship: 1,
}
const DEFAULT_CHECK: ItemProps = {
  required: true,
  requiredMessage: '必填',
}

let isAlllowExt = true
const dealWithUploadErr = (): void => Message.error('只支持单个 pdf 文件上传，请删除错误或者冗余文件类型')

const onFileSelect = (currFile) => {
  const currFileName = currFile.name
  isAlllowExt = path.extname(currFileName).toUpperCase() === '.PDF'
  !isAlllowExt && dealWithUploadErr()
  return isAlllowExt
}
const BasicForm: React.SFC<IBasicFormProps> = (props): React.Element => {
  const { dataSource = {}, history } = props
  const { job = [], resume = [], edu = [] } = dataSource
  const jobOptionList = formatSelectOption(job, false)
  const resumeOptionList = formatSelectOption(resume)
  const eduOptionList = formatSelectOption(edu)
  const [postData, setValue] = useState<IIntervieweesProps>(DEFAULT_DATA)
  const [visible, setVisible] = useState<boolean>(false)
  const resetButton = useRef()

  const resetForm = useCallback((): void => {
    setVisible(false)
    resetButton.current.handleClick()
  }, [setVisible, resetButton])

  const onSubmit = async (values: IIntervieweesProps, errors: []): Promise<void> => {
    if (errors) {
      // logger.error(errors);
      Message.error('请按要求进行填写')
      return
    }
    if (!isAlllowExt || values?.file?.length > 1) {
      dealWithUploadErr()
      return
    }
    const { status, msg }: IResponseType = await addInterviewee(values, values.file[0])
    status ? Message.success(msg || '提交成功') : Message.error(msg || '推荐失败')
    status && setVisible(true)
  }

  const formChange = (values: IBasicFormProps): void => {
    setValue(values)
  }
  const onJumpList = (): void => {
    history.push('/resume/manage')
  }
  return (
    <Card free>
      <Form
        className={styles.BasicForm}
        responsive
        fullWidth
        value={postData}
        labelAlign="top"
        onChange={formChange}
        isPreview={false}
      >
        <FormItem {...formItemLayout.half} label="姓名：" {...DEFAULT_CHECK} hasFeedback minLength={2}>
          <Input placeholder="请输入推荐的候选人姓名" name="name" />
        </FormItem>
        <FormItem
          {...formItemLayout.half}
          label="手机号："
          {...DEFAULT_CHECK}
          format="tel"
          hasFeedback
          pattern={/^1[3456789]\d{9}$/}
        >
          <Input placeholder="请输入推荐的候选人手机号" name="phone" />
        </FormItem>
        <FormItem {...formItemLayout.half} label="邮箱：" {...DEFAULT_CHECK} format="email" hasFeedback>
          <Input placeholder="请输入推荐的候选人邮箱" name="email" />
        </FormItem>
        <FormItem {...formItemLayout.half} label="地址：" {...DEFAULT_CHECK} hasFeedback>
          <Input placeholder="请输入推荐的候选人地址" name="address" />
        </FormItem>
        <FormItem {...formItemLayout.most} label="候选人学历：" {...DEFAULT_CHECK}>
          <Radio.Group name="education" dataSource={eduOptionList} defaultValue="1" aria-label="education of job" />
        </FormItem>
        <FormItem {...formItemLayout.less} label="是否实习：" {...DEFAULT_CHECK}>
          <Radio.Group name="isInternship" defaultValue="1" aria-label="isInternship of job">
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem {...formItemLayout.most} label="招聘类型名称：" {...DEFAULT_CHECK}>
          <Select
            dataSource={resumeOptionList}
            key="uploadType"
            defaultValue="1"
            aria-label="type is"
            {...DEFAULT_SELECT_RENDER_OPTION}
            name="type"
          />
        </FormItem>
        <FormItem
          {...formItemLayout.less}
          label="推荐岗位名称："
          {...DEFAULT_CHECK}
          requiredMessage="请联系系统管理员配置招聘职位"
        >
          <Select
            dataSource={jobOptionList}
            key="jobId"
            aria-label="jobId is"
            {...DEFAULT_SELECT_RENDER_OPTION}
            name="jobId"
          />
        </FormItem>
        <FormItem {...formItemLayout.full} label="推荐理由：" {...DEFAULT_CHECK}>
          <Input.TextArea placeholder="请输入推荐的候选人推荐理由" name="reason" />
        </FormItem>
        <FormItem {...formItemLayout.full} label="推荐备注：">
          <Input.TextArea placeholder="请输入推荐的候选人推荐备注" name="note" />
        </FormItem>
        <FormItem {...formItemLayout.full} label="上传简历：" {...DEFAULT_CHECK}>
          <Upload
            autoUpload={false}
            multiple={false}
            afterSelect={onFileSelect}
            listType="text"
            accept="application/pdf"
            name="file"
            dragable
          >
            <Button type="primary" style={{ margin: '0 0 10px' }}>
              上传简历
            </Button>
          </Upload>
        </FormItem>
        <FixedBottom type="FormItem">
          <FormItem colSpan={12}>
            <Box direction="row" spacing={16} align="center" justify="center">
              <Form.Submit htmlType="submit" type="primary" onClick={onSubmit} validate>
                提交
              </Form.Submit>
              <Form.Reset ref={resetButton} toDefault type="normal">
                {' '}
                重置{' '}
              </Form.Reset>
              <Button type="normal" onClick={onJumpList}>
                {' '}
                查看上传列表
              </Button>
            </Box>
          </FormItem>
        </FixedBottom>
      </Form>
      <BaseDialog
        visible={visible}
        content="是否继续推荐候选人?"
        okName="继续上传"
        cancelName="查看推荐列表"
        onOk={resetForm}
        onCancel={() => {
          resetForm()
          onJumpList()
        }}
        onClose={resetForm}
      />
    </Card>
  )
}

export default withRouter(BasicForm)
