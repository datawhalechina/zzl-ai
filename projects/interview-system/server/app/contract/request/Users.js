
module.exports = {
  listUserRequest: {
    isInner: { type: 'boolean', required: false, description: '是否只看内部员工' }
  },
  userLoginRequest: {
    userName: { type: 'string', required: true, description: '用户姓名' },
    password: { type: 'string', required: true, description: '用户密码' }
  },
  createUserRequest: {
    name: { type: 'string', required: true, description: '用户姓名' },
    phone: { type: 'string', required: true, format: /^1[3456789]\d{9}$/, description: '用户手机号' },
    password: { type: 'string', required: true, description: '用户密码' },
    buId: { type: 'integer', required: true, description: '部门标识外键', convertType: 'number' },
    roleType: { type: 'integer', required: true, description: '用户角色', convertType: 'number' }
  },
  updateUserRequest: {
    name: { type: 'string', required: false, description: '用户姓名' },
    phone: { type: 'string', required: false, format: /^1[3456789]\d{9}$/, description: '用户手机号' },
    password: { type: 'string', required: false, description: '用户密码' },
    buId: { type: 'integer', required: false, description: '部门标识外键', convertType: 'number' },
    roleType: { type: 'integer', required: false, description: '用户角色', convertType: 'number' }
  },
  pageUserRequest: {
    name: { type: 'string', required: false, description: '用户姓名' },
    phone: { type: 'string', required: false, format: /^1[3456789]\d{9}$/, description: '用户手机号' },
    buId: { type: 'integer', required: false, description: '部门标识外键', convertType: 'number' },
    roleType: { type: 'integer', required: false, description: '用户角色', convertType: 'number' },
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
