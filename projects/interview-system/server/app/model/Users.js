const tableName = 'users'

const bcrypt = require('bcrypt')

// 加密权重
const SALT_WORK_FACTOR = 10

module.exports = app => {
  const { INTEGER, BIGINT, STRING, VIRTUAL, TEXT } = app.Sequelize

  const User = app.model.define(tableName, {
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
    isLocked: {
      type: VIRTUAL,
      get () {
        return this.dataValues && !!(this.lock_until && this.lock_until > Date.now())
      },
      comment: '用户是否上锁'
    }
  }, {
    tableName: tableName,
    comment: '用户表',
    hooks: {
      beforeSave: (table, options) => {
        if (!table.password) {
          return true
        }
        // 在数据库中以明文形式存储密码是很糟糕的.
        // 使用适当的哈希函数来加密哈希值更好.
        // 使用用户名作为盐更好.
        return new Promise((resolve, reject) => {
          bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            if (err) reject(err)

            bcrypt.hash(table.password, salt, (error, hash) => {
              if (error) reject(error)

              table.password = hash
              resolve(table)
            })
          })
        })
      }
    }
  })

  User.associate = () => {
    User.belongsTo(app.model.Bu, {
      as: 'bu',
      foreignKey: 'bu_id',
      constraints: false
    })
  }

  User.comparePassword = async (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, function (err, isMatch) {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  }

  User.sync({ alter: true })

  return User
}
