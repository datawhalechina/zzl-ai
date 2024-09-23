
module.exports = {
  createFnsRequest: {
    name: { type: 'string', required: true, description: '职位名' },
    buId: { type: 'integer', required: true, description: '部门标识' }
  },
  updateFnsRequest: {
    name: { type: 'string', required: false, description: '职位名' },
    buId: { type: 'integer', required: false, description: '部门标识' }
  },
  pageFnsRequest: {
    name: { type: 'string', required: false, description: '职位名' },
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
  },
  getFnsBuRequest: {
    buId: { type: 'integer', description: '部门标识', convertType: 'number' }
  }
}
