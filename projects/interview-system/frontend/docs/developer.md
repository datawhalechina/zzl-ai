# 开发纪要

## 请求页面路径代理

主要是通过 `app.ts` 和 `build.json` 中配置实现接口转接代理

将<http://localhost:3333/api/xx> 都转接成 <http://localhost:7001/xx>

> app.ts

``` typescript

const appConfig: IAppConfig = {
  request: {
    // 可选的，全局设置 request 是否返回 response 对象，默认为 false
    // withFullResponse: true,
    baseURL: '/api',
}}
```

> build.json

``` json
{
  "proxy": {
    "/api/": {
      "target": "http://localhost:7001",
      "changeOrigin": true,
      "pathRewrite": { "^/api": "" }
    }
  }
}
```

---

## 用户页面权限管理

主要是通过 `app.ts`， `build.json`和 `frontend/src/layouts/BasicLayout/menuConfig.ts` 进行基础配置

> app.ts

``` typescript

const appConfig: IAppConfig = {
  auth: {
    // 可选的，设置无权限时的展示组件，默认为 null
    // NoAuthFallback: <div>没有权限...</div>,
    // 或者传递一个函数组件
    NoAuthFallback: () => <div>没有权限..</div>
  },
}
```

> build.json

``` json
{
  "plugins": [
    "build-plugin-ice-auth"
  ]
}
```

> menuConfig.ts

在 `menuConfig.ts` 通过 `auth` 属性配置每个页面的访问权限要求

``` typescript

const headerMenuConfig = [
  { path: '/resume/upload', icon: 'smile', name: '新增简历' },
];

const asideMenuConfig = [
  {
    name: '面试管理',
    icon: 'smile',
    children: [
      { path: '/interview/list', name: '面试列表', auth: ['isManage', 'isAdmin'] },
    ],
  },
];

export { headerMenuConfig, asideMenuConfig };
```

在 `frontend/src/pages/Login/components/LoginBlock/index.tsx`  中 登录之后消费用户模型请求，根据获得的用户信息获取相关的权限 Code，再通过 `setAuth(currAuth)` 进行设置。

``` typescript

 const currentUser: IUserProps = (await userDispatchers.getUserInfo());
const currAuth = {
  isLogin: !!currentUser?.id,
  isManage: currentUser?.roleType >= 2,
  isInterview: currentUser?.roleType >= 1,
  isAdmin: currentUser?.roleType >= 3,
};
setAuth(currAuth);
```

---

## interface 开发说明

- 每个组件需要输出有效的可接收的字段 `interface` 说明
- 注意所有 `exports` 的 `interface`，都是以 `I` 开头，比如 `IParam`
- `interface`的属性说明要考虑，字段在初始状态是否为必传的字段
- `interface`的属性说明要考虑，函数字段的返回值可能性

---

## 页面开发注意事项

注意在合适的地方使用合适的 `hook`

- 有些地方是需要全状态有副作用的函数处理，使用 `useEffect`
- 有些地方只是需要在 mount 之后做函数处理，使用 `useMount`
- 要根据实际页面开发需求使用 `useState` 或者 `useSetState`
- 在使用了表单 field 属性之后，一些表单项值设置，注意在 `useEffect` 中重新进行设置

更多内容注意查看 <https://ahooks.js.org/zh-CN/hooks/> 官方文档说明

---

## 接口对接注意事项

一般一个模型接口，对应的接口处理

- getAll[xx]            ==>  获取模型接口所有记录，一般为 GET 请求
- getAll[xx]WithPage    ==>  分页获取模型接口所有记录，一般为 POST 请求
- get[xx]               ==>  通过模型 id 获取对应记录，一般为 GET 请求
- add[xx]               ==>  新增模型记录，一般为 POST 请求
- edit[xx]              ==>  通过模型 id 修改模型记录，一般为 PUT 请求
- delete[xx]            ==>  通过模型 id 删除模型记录，一般为 DELETE 请求

---

## 常用组件

#### 带筛选条件的表格

</frontend/src/components/FilterTable>

在管理页使用比较多，支持传入筛选条件项和表格字段，以及表格刷新等等相关处理

```typescript
interface IFilterTableProps {
  formConfig: {
    other?: {
      needValidate?: boolean;
      [name: string]: unknown;
    }
    data?: object;
    config?: FormProps;
    content: React.Element;
  }
  tableConfig: {
    other?: {
      needPagination?: boolean;
      needIndex?: boolean;
      rowSelectionFn?: (selectedKeys: number[], otherProp: object) => void;
      [name: string]: unknown
    }
    config?: TableProps;
    content: React.Element[];
  }
  getTableData?: (pagination: { current: number; pageSize: number }, formData: { status: 'normal' | 'empty' | 'exception' }) => Promise<any>;
  cellOperation?: React.Element;
  defaultParams?: IGetDataPageParams;
  primaryKey: string;
  [name: string]: unknown;
}

```

基础使用案例

```javascript
import FilterTable, { IGetDataPageParams } from '@/components/FilterTable';
const filterProp = {
  formConfig: {
    content: formContent,
  },
  tableConfig: {
    other: {
      needIndex: false,
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
  </div >)
```

---

### 含有表单项的弹窗组件

<frontend/src/components/DialogTable>

在管理页使用比较多，支持传如弹窗表单项等，做弹窗中表单项的渲染和复制处理

```typescript
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
};
export type ActionType = 'add' | 'edit' | 'preview' | 'config';

export interface IDialogState {
  optCol: any;
  actionType: ActionType;
  actionVisible: boolean;
  isPreview?: boolean;
  other?: object;
  [name: string]: any;
}
```

基础使用案例

```javascript

import DialogTable, { IDialogState } from '@/components/DialogTable';

// 统一维护弹窗相关状态属性
const [dialogConfig, setDialogConfig] = useSetState<IDialogState>({
    optCol: {},
    actionType: 'preview',
    actionVisible: false,
    isPreview: false
  });

// 弹窗结构
<DialogTable
title="指派"
visible={dialogConfig.actionVisible}
actionType={dialogConfig.actionType}
dataSource={dialogConfig.optCol}
onOk={handleOk}
onClose={handleCancel}
onCancel={handleCancel}
>
<FormItem
  required={!dialogConfig.isPreview}
  requiredMessage="必填" label="下一轮面试官">
  <Select name="viewer" dataSource={usersOptionList}  {...DEFAULT_SELECT_RENDER_OPTION}>
  </Select>
</FormItem>
<FormItem
  required={!dialogConfig.isPreview}
  requiredMessage="必填" label="面试环节">
  <Select name="stepName" dataSource={statusOptionList}  {...DEFAULT_SELECT_RENDER_OPTION}>
  </Select>
</FormItem>
</DialogTable>
```

---

### 字体渲染统一组件

<frontend/src/components/FontRender>

在有表格转译项页面使用比较多，主要是对 Icon 组件做统一的字体颜色管理

```typescript
import React from 'react';

const FontRender: React.FC = ({ type = 'default', content, title, ...restProp }: { type: string; content: unknown, title: string }) => {
  const allColor = { default: '#000', error: '#FF3333', warning: '#FFA003', success: '#1DC11D' };
  return (
    <span style={{ color: allColor[type], textAlign: 'center' }} title={title} {...restProp}>
      {content}
    </span>
  );
};

export default FontRender;
```

基础使用案例

```typescript
import FontRender from '@/components/FontRender';

<FontRender type="warning" content={(<Icon type="edit"  />)} />

```

---

### 表单项处理组件

<frontend/src/components/FormItem>

在有下拉框和表单项的页面使用比较多，主要是对表单项目进行统一布局，和下拉框值转化

```typescript
```

基础使用案例

```typescript
import { DEFAULT_SELECT_RENDER_OPTION, formatSelectOption, formatSelectOptionByFn, formItemLayout } from '@/components/FormItem';

// 下拉框 option 数据转译
const usersOptionList = formatSelectOptionByFn(users, (item) => [`${item.buName}/${item.name}`, `${item.id}|${item.name}`]);
const statusOptionList = formatSelectOptionByFn(status, (item) => item.name !== interviewee.stepName ? [item.name, item.name] : '');
const typeOptionList = formatSelectOptionByFn(type, (item) => [item.name, item.name]);

// 使用统一的配置布局和统一的下拉框渲染配置
<Form.Item label="审批人" {...formItemLayout.less} isPreview>
  <Select name="viewer" dataSource={usersOptionList} value={`${user.buName}/${user.name}`} {...DEFAULT_SELECT_RENDER_OPTION}>
  </Select>
</Form.Item>
```

---