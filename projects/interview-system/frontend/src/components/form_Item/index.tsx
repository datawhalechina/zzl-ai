import React from 'react'
import { Input, Form, ResponsiveGrid, Select, DatePicker, Radio, Upload } from '@alifd/next'

// import { UploadProps } from '@alifd/next/types/upload'
import { ItemProps, FormProps } from '@alifd/next/types/form'
import { InputProps } from '@alifd/next/types/input'
import { Rule } from '@alifd/next/types/field'

const FormItem = Form.Item

// https://ice.work/component/input
export const formItemLayout = {
  full: {
    colSpan: 12,
  },
  most: {
    colSpan: 8,
  },
  half: {
    colSpan: 6,
  },
  less: {
    colSpan: 4,
  },
}

export const DEFAULT_SELECT_RENDER_OPTION = {
  showSearch: true,
  filterLocal: true,
  hasClear: true,
}
const formItemLayoutObject = {
  full: 12,
  half: 6,
}

export interface IOptionProps extends Partial<ItemProps> {
  index?: number;
}
export interface ICustomPropsProps extends Partial<ItemProps> {
  type?: string;
}

export interface IOtherProps {
  dataToggle?: 'string';
  [key: string]: unknown;
}
export interface IAllowType {
  TextArea?: string;
  Group?: string;
  Password?: string;
  Text?: string;
}
export interface IBasicFormItemProps {
  name?: string;
  type?: keyof IAllowType | string;
  options?: IOptionProps;
  customProps?: InputProps;
  rules?: Rule[];
  layout?: 'full' | 'half';
  content?: string | React.ReactDOM;
}

const tranItemType = (type?: string) => {
  if (!type) {
    return Input
  }
  let res = Input[type]
  switch (type) {
    case 'Select': {
      res = Select
      break
    }
    case 'Date': {
      res = DatePicker
      break
    }
    case 'Radio': {
      res = Radio
      break
    }
    case 'Upload': {
      res = Upload
      break
    }
    default: {
      break
    }
  }
  return res
}

const tranItemContent = (type: string, content: string | React.ReactDOM) => {
  if (!content) {
    return ''
  }
  const res = content
  switch (type) {
    case 'Select': {
      break
    }
    case 'Date': {
      break
    }
    case 'Radio': {
      break
    }
    case 'Upload': {
      break
    }
    default: {
      break
    }
  }
  return res
}

const BasicFormItem: React.SFC<IBasicFormItemProps> = (props: IBasicFormItemProps): React.Element => {
  // 这么写是为了防止restProps中 带入 onChange, defaultValue
  // TODO check Prop
  const { type, customProps, rules, name, layout = 'full', options, ...restProps } = props
  if (!name) {
    return null
  }
  const otherProps = restProps || {}
  const CurrItem = tranItemType(type)
  const currLayout = `span 1 / span ${formItemLayoutObject[layout]}`
  const currContent = tranItemContent(type || 'Text', otherProps.content) || ''
  return (
    <FormItem {...options} colSpan={formItemLayoutObject[layout]} style={{ gridArea: currLayout }}>
      <CurrItem name={name} {...customProps} {...otherProps} aria-label={`${name} is`}>
        {currContent}
      </CurrItem>
    </FormItem>
  )
}

export interface IBasicFormProps {
  formProps: FormProps;
  itemList: {
    [name: string]: IBasicFormItemProps;
  };
}

export const DefaultForm = (props: IBasicFormProps): React.Element => {
  const { formProps, itemList, ...restProps } = props
  return (
    <Form
      labelAlign="top"
      // responsive
      fullWidth
      isPreview={false}
      {...formProps}
      {...restProps}
    >
      <ResponsiveGrid gap={10}>
        {Object.keys(itemList).map((key) => (
          <BasicFormItem key={key} name={key} {...itemList[key]} />
        ))}
      </ResponsiveGrid>
    </Form>
  )
}

export type WrappedItemProps = IBasicFormItemProps
export interface WrappedItemType {
  [key: string]: React.FC<IBasicFormItemProps>;
}

export function FormatFormItems<T extends object>(mapItemObj: T) {
  const tempFormItems: Array<Partial<WrappedItemType>> = []
  Object.keys(mapItemObj).forEach((key) => {
    const item = mapItemObj[key]
    tempFormItems.push(<BasicFormItem key={key} name={key} {...item} />)
  })
  return tempFormItems
}

export function _FormatFormItems<T extends object>(mapItemObj: T) {
  const tempFormItems: Array<Partial<WrappedItemType>> = []
  Object.keys(mapItemObj).forEach((key) => {
    const item = mapItemObj[key]
    tempFormItems.push((props: IBasicFormItemProps) => (
      <BasicFormItem customProps={item.props} rules={item.rules} {...props} type={key} />
    ))
  })
  return tempFormItems
}

export interface IOption {
  label: string;
  value: string;
}

export function formatSelectOption(
  dataSource: [{ name?: string; value?: string }] | string[],
  hasValue = true,
): IOption[] {
  return dataSource.map((item, idx) => ({
    label: item.name || item,
    value: hasValue ? item.value || item.name || item : item.id || idx,
  }))
}

export function formatSelectOptionByField(
  dataSource: [{ name?: string; value?: string }] | string[],
  { valueAttr = 'value', nameAttr = 'name' }: { nameAttr?: string; valueAttr?: string },
): IOption[] {
  return dataSource.map((item) => ({ label: item[nameAttr], value: item[valueAttr] }))
}

export function formatSelectOptionByFn(
  dataSource: [{ name?: string; value?: string }] | string[],
  handleItem: (item, idx) => [string, number | void] | string[] | string | void,
): IOption[] {
  return dataSource.reduce((prev, curr, idx) => {
    const currItem = handleItem(curr, idx)
    currItem && prev.push({ label: currItem[0], value: currItem[1] })
    return prev
  }, []) as IOption[]
}

export default BasicFormItem
