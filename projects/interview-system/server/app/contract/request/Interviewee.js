
module.exports = {
  createIntervieweeRequest: {
    name: {
      type: 'string',
      required: true,
      description: '候选人姓名'
    },
    phone: {
      type: 'string',
      required: true,
      format: /^1[3456789]\d{9}$/,
      description: '候选人电话号码'
    },
    email: {
      type: 'string',
      required: true,
      description: '候选人电子邮箱'
    },
    address: {
      type: 'string',
      required: true,
      description: '候选人地址'
    },
    education: {
      type: 'string',
      required: true,
      description: '候选人学历,一般为 高中,大专,本科,研究生,博士,其他'
    },
    type: {
      type: 'integer',
      required: true,
      values: [0, 1],
      convertType: 'number',
      description: '招聘类型, 0 社招 1 校招,默认 0'
    },
    isInternship: {
      type: 'integer',
      required: true,
      values: [0, 1],
      convertType: 'number',
      description: '是否实习 0 试用 1 实习,默认 0'
    },
    jobId: {
      type: 'integer',
      required: true,
      convertType: 'number',
      description: '推荐岗位外键'
    },
    reason: {
      type: 'string',
      required: true,
      description: '推荐理由'
    },
    note: {
      type: 'string',
      required: false,
      description: '推荐备注'
    }
  },
  updateIntervieweeRequest: {
    reason: {
      type: 'string',
      required: false,
      description: '推荐理由'
    },
    note: {
      type: 'string',
      required: false,
      description: '推荐备注'
    },
    status: {
      type: 'string',
      required: false,
      description: '面试状态'
    },
    state: {
      type: 'integer',
      required: false,
      values: [0, 1],
      convertType: 'number',
      description: '数据是否有效 0 无效 , 1 有效'
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
    }
  },
  pageIntervieweeRequest: {
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
    reason: {
      type: 'string',
      required: false,
      description: '推荐理由'
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
    recommenderId: {
      type: 'integer',
      required: false,
      convertType: 'number',
      description: '内推人逻辑外键'
    },
    pageNo: {
      type: 'integer',
      description: '页面数',
      required: false,
      default: 1,
      convertType: 'number'
    },
    pageSize: {
      type: 'integer',
      description: '页面条数',
      required: false,
      default: 10,
      convertType: 'number'
    }
  }
}
