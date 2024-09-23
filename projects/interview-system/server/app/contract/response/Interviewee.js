
module.exports = {
  uploadResponse: {
    resumePath: { type: 'string', description: '简历地址' }
  },
  intervieweeJoinResponse: {
    id: {
      type: 'integer',
      required: false,
      convertType: 'number',
      description: '主键'
    },
    name: {
      type: 'string',
      required: false,
      description: '候选人姓名'
    },
    phone: {
      type: 'string',
      required: false,
      format: /^1[3456789]\d{9}$/,
      description: '候选人电话号码'
    },
    email: {
      type: 'string',
      required: false,
      description: '候选人电子邮箱'
    },
    address: {
      type: 'string',
      required: false,
      description: '候选人地址'
    },
    education: {
      type: 'string',
      required: false,
      description: '候选人学历,一般为 高中,大专,本科,研究生,博士,其他'
    },
    type: {
      type: 'integer',
      required: false,
      values: [0, 1],
      convertType: 'number',
      description: '招聘类型, 0 社招 1 校招,默认 0'
    },
    isInternship: {
      type: 'integer',
      required: false,
      values: [0, 1],
      convertType: 'number',
      description: '是否实习 0 试用 1 实习,默认 0'
    },
    jobId: {
      type: 'integer',
      required: false,
      convertType: 'number',
      description: '推荐岗位外键'
    },
    jobName: {
      type: 'string',
      required: false,
      description: '岗位名称'
    },
    reason: {
      type: 'string',
      required: false,
      description: '推荐理由'
    },
    channel: {
      type: 'integer',
      values: [0, 1],
      required: false,
      description: '招聘渠道 0 外部 1 内部,默认 0'
    },
    status: {
      type: 'integer',
      required: false,
      description: '面试状态,一面,二面,三面,四面,五面,六面,发放 offer,正式入职'
    },
    state: {
      type: 'integer',
      defaultValue: 1,
      description: '数据是否有效,0 无效,1 有效,默认 1'
    },
    isSuccess: {
      type: 'integer',
      required: false,
      description: '是否成功 0 不成功 1 成功'
    },
    resumePath: {
      type: 'string',
      required: false,
      description: '简历路径'
    },
    note: {
      type: 'string',
      required: false,
      description: '推荐备注'
    },
    viewerId: {
      type: 'integer',
      required: false,
      convertType: 'number',
      description: '面试官外键'
    },
    recommenderId: {
      type: 'integer',
      required: false,
      convertType: 'number',
      description: '内推人逻辑外键'
    },
    recommenderName: {
      type: 'string',
      required: false,
      description: '内推人姓名'
    }
  }
}
