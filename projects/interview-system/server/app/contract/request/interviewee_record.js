
module.exports = {
  createIntervieweeRecordRequest: {
    viewerId: {
      type: 'integer',
      required: false,
      comment: '面试官外键'
    },
    viewerName: {
      type: 'string',
      required: false,
      comment: '面试官姓名'
    },
    intervieweeId: {
      type: 'integer',
      required: true,
      description: '求职者外键'
    },
    step: {
      type: 'integer',
      required: false,
      description: '第几面',
      // 0 未进行面谈 1 一面 2 二面 3 三面 4 四面 5 电面 6 面试通过 7 发放 offer 8 正式入职 9 对方拒绝
      default: 0,
      min: 0,
      max: 15
    },
    comment: {
      type: 'string',
      required: false,
      description: '面试评语'
    }
  },
  updateIntervieweeRecordRequest: {
    state: {
      type: 'integer',
      required: false,
      description: '面试流程是否结束',
      values: [0, 1]
    },
    comment: {
      type: 'string',
      required: true,
      description: '面试评语'
    },
    type: {
      type: 'string',
      description: '当前面试方式 一般 现场面试, 电话面试, 视频面试, 其他'
    }
  },
  nextIntervieweeRecordRequest: {
    viewerId: {
      type: 'integer',
      required: true,
      convertType: 'number',
      description: '面试官外键'
    },
    viewerName: {
      type: 'string',
      required: true,
      description: '面试官姓名'
    },
    intervieweeId: {
      type: 'integer',
      required: true,
      convertType: 'number',
      description: '求职者外键'
    },
    intervieweeName: {
      type: 'string',
      required: true,
      description: '候选人姓名'
    },
    step: {
      type: 'integer',
      required: true,
      description: '第几面',
      convertType: 'number',
      default: 0,
      min: 0,
      max: 15
    },
    stepName: {
      type: 'string',
      required: true,
      description: '当前步骤名称 一般 0 一面 1 二面 2 三面 3 四面 4 电面 5 面试通过 6 发放 offer 7 正式入职 8 对方拒绝'
    },
    comment: {
      type: 'string',
      required: true,
      description: '面试评语'
    },
    isSuccess: {
      type: 'integer',
      required: true,
      convertType: 'number',
      description: '是否成功 0 不成功 1 成功'
    }
  },
  deleteIntervieweeRecordRequest: {
    intervieweeId: {
      type: 'integer',
      required: true,
      description: '求职者外键'
    }
  }
}
