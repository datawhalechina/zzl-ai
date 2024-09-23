import React, { useState } from 'react'
import { Form, Table, Card, Field, Pagination, Button, Icon } from '@alifd/next'
import { useFusionTable } from 'ahooks'
import { withRouter } from 'ice'
import ExceptionBlock from './components/table_exception/'
import EmptyBlock from '@/components/empty_block'

import { TableProps } from '@alifd/next/types/table'
import { FormProps } from '@alifd/next/types/form'
import styles from './index.module.scss'
import FontRender from '../font_render'

export interface IGetDataPageParams {
  current: number;
  pageSize: number;
}

export interface IGetDataFormParams {
  status: 'normal' | 'empty' | 'exception';
  [name: string]: any;
}

export interface IFilterTableProps {
  formConfig: {
    other?: {
      needValidate?: boolean;
      [name: string]: unknown;
    };
    data?: object;
    config?: FormProps;
    content: React.Element;
  };
  tableConfig: {
    other?: {
      needPagination?: boolean;
      needIndex?: boolean;
      rowSelectionFn?: (selectedKeys: number[], otherProp: object) => void;
      [name: string]: unknown;
    };
    config?: TableProps;
    content: React.Element[];
  };
  getTableData?: (
    pagination: { current: number; pageSize: number },
    formData: { status: 'normal' | 'empty' | 'exception' },
  ) => Promise<any>;
  cellOperation?: React.Element;
  defaultParams?: IGetDataPageParams;
  primaryKey: string;
  [name: string]: unknown;
}

const FilterTable = (props: IFilterTableProps): React.Element => {
  const {
    formConfig: { data: formData, config: formConfig, content: formContent, other: formOtherConfig } = {},
    tableConfig: { other: tableOtherConfig, config: tableDefaultConfig, content: tableColumnContent = [] } = {},
    getTableData = (): void => {},
    cellOperation,
    defaultParams,
    primaryKey,
  } = props

  const { current = 1, pageSize = 5 } = defaultParams || {}
  const { needPagination = true, needIndex = false, rowSelectionFn } = tableOtherConfig || {}
  const { needValidate = false } = formOtherConfig || {}

  const field = Field.useField(formData)
  const { paginationProps, tableProps, search, error, refresh, loading } = useFusionTable(getTableData, {
    defaultParams: [{ current, pageSize }],
    field,
  })
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>()
  const { submit, reset } = search
  const clearSelectRest = () => {
    reset()
    setSelectedRowKeys([])
  }
  const rowSelectionConfig = rowSelectionFn
    ? {
      rowSelection: {
        selectedRowKeys,
        onChange: (selectedKeys) => {
          setSelectedRowKeys(selectedKeys)
          rowSelectionFn && rowSelectionFn(selectedKeys, { submit, reset: clearSelectRest })
        },
      },
    }
    : {}
  return (
    <div className={styles.FilterTable}>
      <Card free className={styles.Card}>
        <Card.Content>
          <Form field={field} responsive fullWidth wrapperCol={{ span: 12, offset: 1 }} {...formConfig}>
            {formContent}
            <Form.Item colSpan={1}>
              <Form.Submit
                loading={loading}
                id="js-query-table"
                validate={needValidate}
                type="primary"
                onClick={submit}
              >
                查询
              </Form.Submit>
            </Form.Item>
            <Form.Item colSpan={1}>
              <Button onClick={reset} id="js-reset-table" type="secondary">
                {' '}
                重置
              </Button>
            </Form.Item>
          </Form>
        </Card.Content>
      </Card>
      <Card free>
        <Card.Content>
          <Table
            hasBorder={false}
            {...tableProps}
            emptyContent={error ? <ExceptionBlock onRefresh={refresh} /> : <EmptyBlock />}
            primaryKey={primaryKey}
            isZebra
            stickyHeader
            {...tableDefaultConfig}
            {...rowSelectionConfig}
          >
            {needIndex && (
              <Table.Column
                key="index"
                title="序号"
                dataIndex="index"
                width={60}
                cell={(v: string, i: number) => i + 1}
              />
            )}
            {tableColumnContent}
            {cellOperation && (
              <Table.Column
                title="操作"
                cell={(...arg) => cellOperation({ submit, reset, dataSource: tableProps.dataSource }, ...arg)}
              />
            )}
          </Table>
          {needPagination && (
            <Pagination
              style={{ marginTop: 16, textAlign: 'right' }}
              totalRender={(total) => (
                <>
                  共{' '}
                  <Button text type="primary">
                    {total}
                  </Button>{' '}
                  个记录
                </>
              )}
              {...paginationProps}
            />
          )}
        </Card.Content>
      </Card>
    </div>
  )
}

interface ITableBtnParams {
  handle: () => void;
}
const DEFAULT_TABLE_BTN_CONFIG = {
  type: 'primary',
  size: 'small',
  text: true,
}
const DEFAULT_TABLE_ICON_CONFIG = {
  size: 'small',
}
FilterTable.EditBtn = ({ handle }: ITableBtnParams): React.Element => {
  return (
    <Button title="编辑" {...DEFAULT_TABLE_BTN_CONFIG} onClick={handle}>
      <FontRender type="warning" content={<Icon type="edit" {...DEFAULT_TABLE_ICON_CONFIG} />} />
    </Button>
  )
}

FilterTable.DeleteBtn = ({ handle }: ITableBtnParams): React.Element => {
  return (
    <Button title="删除" {...DEFAULT_TABLE_BTN_CONFIG} onClick={handle}>
      <FontRender type="error" content={<Icon type="ashbin" {...DEFAULT_TABLE_ICON_CONFIG} />} />
    </Button>
  )
}

FilterTable.PreviewBtn = ({ handle }: ITableBtnParams): React.Element => {
  return (
    <Button title="查看" {...DEFAULT_TABLE_BTN_CONFIG} onClick={handle}>
      <FontRender type="success" content={<Icon type="eye" {...DEFAULT_TABLE_ICON_CONFIG} />} />
    </Button>
  )
}

FilterTable.SettingBtn = ({ handle }: ITableBtnParams): React.Element => {
  return (
    <Button title="设置" {...DEFAULT_TABLE_BTN_CONFIG} onClick={handle}>
      <FontRender type="normal" content={<Icon type="set" {...DEFAULT_TABLE_ICON_CONFIG} />} />
    </Button>
  )
}

FilterTable.LockBtn = ({ handle }: ITableBtnParams): React.Element => {
  return (
    <Button title="上锁" {...DEFAULT_TABLE_BTN_CONFIG} onClick={handle}>
      <FontRender type="error" content={<Icon type="lock" {...DEFAULT_TABLE_ICON_CONFIG} />} />
    </Button>
  )
}

FilterTable.UnlockBtn = ({ handle }: ITableBtnParams): React.Element => {
  return (
    <Button title="解锁" {...DEFAULT_TABLE_BTN_CONFIG} onClick={handle}>
      <FontRender type="success" content={<Icon type="unlock" {...DEFAULT_TABLE_ICON_CONFIG} />} />
    </Button>
  )
}

FilterTable.DetialBtn = ({ handle }: ITableBtnParams): React.Element => {
  return (
    <Button title="查看" {...DEFAULT_TABLE_BTN_CONFIG} onClick={handle}>
      <FontRender type="success" content={<Icon type="ellipsis" {...DEFAULT_TABLE_ICON_CONFIG} />} />
    </Button>
  )
}

export default withRouter(FilterTable)
