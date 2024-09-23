const tableName = 'users'

const bcrypt = require('bcrypt')

// 加密权重
const SALT_WORK_FACTOR = 10

const bcryptPassword = (password) => new Promise((resolve, reject) => {
  // 在数据库中以明文形式存储密码是很糟糕的.
  // 使用适当的哈希函数来加密哈希值更好.
  // 使用用户名作为盐更好.
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR, 'b')
  const hash = bcrypt.hashSync(password, salt)
  resolve(hash)
})

// 1 外部猎头 2 面试官 3 部门经理  4 超级管理者
const getUserData = async () => ([{
  id: 1,
  name: 'admin',
  phone: '13456787889',
  password: await bcryptPassword('xiaojurun-admin'),
  role_type: 3,
  bu_id: 1,
  created_at: new Date(),
  updated_at: new Date()
},
{ // 面试官角色
  id: 2,
  name: 'manager',
  phone: '13456009899',
  password: await bcryptPassword('xiaojurun-manager'),
  role_type: 2,
  bu_id: 1,
  created_at: new Date(),
  updated_at: new Date()
},
{ // HR 角色
  id: 3,
  name: 'user',
  phone: '13456780099',
  password: await bcryptPassword('xiaojurun-user'),
  role_type: 1,
  bu_id: 1,
  created_at: new Date(),
  updated_at: new Date()
},
{ // 招聘方 角色
  id: 4,
  name: 'test',
  phone: '13456789899',
  password: await bcryptPassword('xiaojurun'),
  role_type: 0,
  bu_id: 1,
  created_at: new Date(),
  updated_at: new Date()
}, {
  id: 5,
  name: 'xiaoju',
  phone: '15107915609',
  password: await bcryptPassword('xiaoju-admin'),
  role_type: 4,
  bu_id: 1,
  created_at: new Date(),
  updated_at: new Date()
}
])

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(tableName, await getUserData(), {})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName)
  }
}
