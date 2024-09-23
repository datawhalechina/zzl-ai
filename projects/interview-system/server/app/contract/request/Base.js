
module.exports = {
  getPageRequest: {
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
