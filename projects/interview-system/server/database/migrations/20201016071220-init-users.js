
const tableName = 'users'

const bcrypt = require('bcrypt')

// 加密权重
const SALT_WORK_FACTOR = 10

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, BIGINT, DATE, NOW, STRING, TEXT } = Sequelize
    return queryInterface.createTable(tableName, {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键',
        unique: 'userId'
      },
      name: {
        type: STRING(50),
        allowNull: false,
        comment: '用户姓名'
      },
      phone: {
        type: STRING(11),
        allowNull: false,
        unique: 'userPhone',
        is: /^1[3456789]\d{9}$/,
        comment: '用户手机号'
      },
      password: {
        type: TEXT,
        allowNull: false,
        comment: '用户密码'
      },
      login_attempts: { //
        type: INTEGER,
        allowNull: true,
        default: 0,
        comment: '登录失败的次数'
      },
      lock_until: {
        type: BIGINT,
        allowNull: true,
        comment: '登录失败被锁定后，多久后释放'
      },
      bu_id: {
        type: INTEGER,
        allowNull: true,
        comment: '部门标识外键'
      },
      role_type: {
        type: INTEGER(1),
        allowNull: false,
        comment: '用户角色',
        // 1 外部猎头 2 面试官 3 部门经理  4 超级管理者
        defaultValue: 1,
        validate: {
          min: 1,
          max: 4
        }
      },
      created_at: {
        type: DATE,
        allowNull: true,
        defaultValue: NOW,
        comment: '创建日期'
      },
      updated_at: {
        type: DATE,
        allowNull: true,
        defaultValue: NOW,
        comment: '更新日期'
      },

      deleted_at: {
        type: DATE,
        allowNull: true,
        comment: '删除日期'
      }
    }, {
      paranoid: true,
      deletedAt: true,
      underscored: true,
      freezeTableName: true,
      tableName: tableName,
      version: true,
      comment: '用户表'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName)
  }
}
