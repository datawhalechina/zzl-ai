
const tableName = 'job'

module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize

  const Job = app.model.define(tableName, {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键'
    },
    name: {
      type: STRING,
      allowNull: false,
      comment: '岗位名称'
    },
    responsibility: {
      type: TEXT,
      allowNull: false,
      comment: '岗位职责'
    },
    description: {
      type: TEXT,
      allowNull: false,
      comment: '岗位描述'
    },
    bu_id: {
      type: INTEGER,
      allowNull: true,
      comment: 'BU逻辑外键'
    },
    function_id: {
      type: INTEGER,
      allowNull: true,
      comment: 'function 逻辑外键'
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      comment: '用户逻辑外键'
    },
    state: {
      type: INTEGER(1),
      defaultValue: 1,
      comment: '数据是否有效'
    }
  }, {
    tableName: tableName,
    comment: '岗位表',
    hooks: {
    }
  })
  Job.associate = () => {
    Job.belongsTo(app.model.Bu, {
      as: 'bu',
      foreignKey: 'bu_id',
      constraints: false
    })
    Job.belongsTo(app.model.Functions, {
      as: 'function',
      foreignKey: 'function_id',
      constraints: false
    })
    Job.belongsTo(app.model.Users, {
      as: 'user',
      foreignKey: 'user_id',
      constraints: false
    })
  }

  Job.sync({ alter: true })
  return Job
}
