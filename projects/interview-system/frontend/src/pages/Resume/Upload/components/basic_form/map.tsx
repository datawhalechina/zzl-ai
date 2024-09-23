export default ({ DEFAULT_CHECK }: { DEFAULT_CHECK: object }) => ({
  name: {
    layout: 'half',
    name: 'name',
    type: '',
    options: {
      ...DEFAULT_CHECK,
      hasFeedback: true,
      minLength: 2,
      label: '姓名：',
    },
    customProps: {
      name: 'name',
      placeholder: '请输入推荐的候选人姓名',
    },
    rules: [
      {
        required: true,
        message: 'Please enter name!',
      },
    ],
  },
  phone: {
    layout: 'half',
    name: 'phone',
    type: '',
    options: {
      ...DEFAULT_CHECK,
      hasFeedback: true,
      label: '手机号：',
      format: 'tel',
      pattern: /^1[3456789]\d{9}$/,
    },
    customProps: {
      name: 'phone',
      placeholder: '请输入推荐的候选人手机号',
    },
    rules: [
      {
        required: true,
        message: 'Please enter phone!',
      },
    ],
  },
  email: {
    layout: 'half',
    name: 'email',
    type: '',
    options: {
      ...DEFAULT_CHECK,
      hasFeedback: true,
      label: '邮箱：',
      format: 'email',
    },
    customProps: {
      name: 'email',
      placeholder: '请输入推荐的候选人邮箱',
    },
    rules: [
      {
        required: true,
        message: 'Please enter email!',
      },
    ],
  },
  isInternship: {
    layout: 'full',
    name: 'email',
    type: '',
    options: {
      ...DEFAULT_CHECK,
      label: '是否实习：',
    },
    customProps: {
      name: 'isInternship',
      placeholder: '请输入推荐的候选人是否实习',
    },
    rules: [
      {
        required: true,
        message: 'Please enter isInternship!',
      },
    ],
  },
  reason: {
    layout: 'full',
    name: 'reason',
    type: 'TextArea',
    options: {
      ...DEFAULT_CHECK,
      label: '推荐理由：',
    },
    customProps: {
      name: 'reason',
      placeholder: '请输入推荐的候选人推荐理由',
    },
    rules: [
      {
        required: true,
        message: 'Please enter reason!',
      },
    ],
  },
})
