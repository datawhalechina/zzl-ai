
const tableName = 'interviewee_record'

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize

  const IntervieweeRecord = app.model.define(tableName, {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
      unique: true
    },
    viewer_id: {
      type: INTEGER,
      allowNull: false,
      comment: '面试官外键'
    },
    viewer_name: {
      type: STRING,
      allowNull: false,
      comment: '面试官姓名'
    },
    interviewee_id: {
      type: INTEGER,
      allowNull: false,
      comment: '候选人外键'
    },
    interviewee_name: {
      type: STRING,
      allowNull: false,
      comment: '候选人姓名'
    },
    state: {
      type: INTEGER,
      allowNull: false,
      comment: '面试流程是否结束',
      values: [0, 1]
    },
    step: {
      type: INTEGER,
      allowNull: false,
      comment: '第几面',
      defaultValue: 0,
      validate: {
        min: 0,
        max: 15
      }
    },
    type: {
      type: STRING,
      allowNull: true,
      comment: '当前面试方式'
    },
    step_name: {
      type: STRING,
      allowNull: true,
      comment: '当前步骤名称'
    },
    comment: {
      type: STRING(500),
      allowNull: true,
      comment: '面试评语'
    }
  }, {
    tableName: tableName,
    comment: '面试记录表',
    hooks: {
    }
  })

  IntervieweeRecord.associate = () => {
    IntervieweeRecord.belongsTo(app.model.Users, {
      as: 'viewr',
      foreignKey: 'viewer_id',
      constraints: false
    })
    IntervieweeRecord.belongsTo(app.model.Interviewee, {
      as: 'interviewee',
      foreignKey: 'interviewee_id',
      constraints: false
    })
  }

  IntervieweeRecord.sync({ alter: true })
  return IntervieweeRecord
}
