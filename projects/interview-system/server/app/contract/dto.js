
module.exports = {
  bu: {
    id: { type: 'integer', description: 'id 唯一键' },
    name: { type: 'string', description: '部门名' }
  },
  users: {
    id: { type: 'integer', required: false, description: 'id 唯一键' },
    name: { type: 'string', required: false, description: '用户姓名' },
    phone: { type: 'string', required: false, format: /^1[3456789]\d{9}$/, description: '用户手机号' },
    password: { type: 'string', required: false, description: '用户密码' },
    buId: { type: 'integer', required: false, description: '部门标识外键', convertType: 'number' },
    roleType: { type: 'integer', required: false, description: '用户角色', convertType: 'number' }
  },
  sys_dicItems: {
    id: { type: 'integer', required: false, description: 'id 唯一键' },
    name: { type: 'string', required: false, description: '字典名' },
    value: { type: 'string', required: false, description: '字典值' },
    note: { type: 'string', required: false, description: '字典备注' },
    groupName: { type: 'string', required: false, description: '字典分类' },
    sortNum: { type: 'integer', required: false, description: '字典排序' },
    enable: {
      type: 'integer',
      required: false,
      default: 1,
      values: [0, 1],
      description: '字典是否启用'
    }
  },
  functions: {
    id: { type: 'integer', description: 'id 唯一键' },
    name: { type: 'string', description: '部门名' },
    buId: { type: 'integer', description: '部门标识' }
  },
  interviewee: {
    id: {
      type: 'integer',
      description: '候选人 id'
    },
    name: {
      type: 'string',
      description: '候选人姓名'
    },
    phone: {
      type: 'string',
      format: /^1[3456789]\d{9}$/,
      description: '候选人电话号码'
    },
    email: {
      type: 'string',
      description: '候选人电子邮箱'
    },
    address: {
      type: 'string',
      description: '候选人地址'
    },
    education: {
      type: 'string',
      description: '候选人学历,一般为 高中,大专,本科,研究生,博士,其他'
    },
    type: {
      type: 'integer',
      values: [0, 1],
      convertType: 'number',
      description: '招聘类型, 0 社招 1 校招,默认 0'
    },
    isInternship: {
      type: 'integer',
      values: [0, 1],
      convertType: 'number',
      description: '是否实习 0 试用 1 实习,默认 0'
    },
    jobId: {
      type: 'integer',
      convertType: 'number',
      description: '推荐岗位外键'
    },
    reason: {
      type: 'string',
      description: '推荐理由'
    },
    resumePath: {
      type: 'string',
      description: '简历路径'
    },
    note: {
      type: 'string',
      description: '推荐备注'
    },
    channel: {
      type: 'integer',
      values: [0, 1],
      convertType: 'number',
      description: '招聘渠道 0 外部 1 内部'
    },
    status: {
      type: 'string',
      description: '面试状态'
    },
    state: {
      type: 'integer',
      values: [0, 1],
      convertType: 'number',
      description: '数据是否有效 0 无效 , 1 有效'
    },
    viewerId: {
      type: 'integer',
      convertType: 'number',
      description: '面试官外键'
    },
    recommenderId: {
      type: 'integer',
      convertType: 'number',
      description: '内推人逻辑外键'
    },
    isSuccess: {
      type: 'integer',
      required: false,
      description: '是否成功 0 不成功 1 成功'
    }
  },
  interviewee_record: {
    id: {
      type: 'integer',
      description: '主键'
    },
    viewerId: {
      type: 'integer',
      description: '面试官外键'
    },
    intervieweeId: {
      type: 'integer',
      description: '候选人外键'
    },
    state: {
      type: 'integer',
      description: '面试流程是否结束',
      values: [0, 1]
    },
    step: {
      type: 'integer',
      description: '第几面',
      default: 0,
      min: 0,
      max: 15
    },
    stepName: {
      type: 'string',
      description: '当前步骤名称 一般 0 一面 1 二面 2 三面 3 四面 4 电面 5 面试通过 6 发放 offer 7 正式入职 8 对方拒绝'
    },
    type: {
      type: 'string',
      description: '当前面试方式 一般 现场面试, 电话面试, 视频面试, 其他'
    },
    comment: {
      type: 'string',
      description: '面试评语'
    }
  },
  job: {
    id: {
      type: 'integer',
      description: 'id 唯一键',
      convertType: 'number',
      required: false
    },
    name: {
      type: 'string',
      description: '岗位名称',
      required: false
    },
    responsibility: {
      type: 'string',
      description: '岗位职责',
      required: false
    },
    description: {
      type: 'string',
      description: '岗位描述',
      required: false
    },
    buId: {
      type: 'integer',
      convertType: 'number',
      description: 'BU逻辑外键',
      required: false
    },
    userId: {
      type: 'integer',
      convertType: 'number',
      description: '用户逻辑外键',
      required: false
    },
    state: {
      type: 'integer',
      description: '数据是否有效',
      convertType: 'number',
      required: false
    }
  }
}
