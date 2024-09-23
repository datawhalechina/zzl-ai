
module.exports = {
  createJobRequest: {
    name: {
      type: 'string',
      description: '岗位名称',
      required: true
    },
    responsibility: {
      type: 'string',
      description: '岗位职责',
      required: true
    },
    description: {
      type: 'string',
      description: '岗位描述',
      required: true
    },
    buId: {
      type: 'integer',
      convertType: 'number',
      description: 'BU逻辑外键',
      required: false
    },
    functionId: {
      type: 'integer',
      convertType: 'number',
      description: 'function 逻辑外键',
      required: false
    }
  },
  updateJobRequest: {
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
    functionId: {
      type: 'integer',
      convertType: 'number',
      description: 'function 逻辑外键',
      required: false
    }
  },
  pageJobsRequest: {
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
    functionId: {
      type: 'integer',
      convertType: 'number',
      description: 'function 逻辑外键',
      required: false
    },
    state: {
      type: 'enum',
      values: [0, 1],
      default: 1,
      description: '数据是否有效',
      convertType: 'number',
      required: false
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
