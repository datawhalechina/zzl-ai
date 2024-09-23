
module.exports = {
  IntervieweeRecordJoinResponse: {
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
    intervieweeName: {
      type: 'string',
      description: '候选人姓名'
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
    },
    resumePath: {
      type: 'string',
      description: '简历路径'
    },
    intervieweeEmail: {
      type: 'string',
      description: '候选人电子邮箱'
    },
    intervieweeTel: {
      type: 'string',
      format: /^1[3456789]\d{9}$/,
      description: '候选人电话号码'
    },
    jobId: {
      type: 'integer',
      convertType: 'number',
      description: '推荐岗位外键'
    },
    address: {
      type: 'string',
      description: '候选人地址'
    },
    education: {
      type: 'string',
      description: '候选人学历,一般为 高中,大专,本科,研究生,博士,其他'
    },
    intervieweeType: {
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
    reason: {
      type: 'string',
      description: '推荐理由'
    },
    channel: {
      type: 'integer',
      values: [0, 1],
      convertType: 'number',
      description: '招聘渠道 0 外部 1 内部'
    },
    intervieweeNote: {
      type: 'string',
      description: '推荐备注'
    },
    isSuccess: {
      type: 'integer',
      required: false,
      description: '是否成功 0 不成功 1 成功'
    }
  },
  IntervieweeRecordProgressResponse: {
    id: {
      type: 'integer',
      description: '主键'
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
    comment: {
      type: 'string',
      description: '面试评语'
    },
    type: {
      type: 'string',
      description: '当前面试方式 一般 现场面试, 电话面试, 视频面试, 其他'
    }
  }
}
