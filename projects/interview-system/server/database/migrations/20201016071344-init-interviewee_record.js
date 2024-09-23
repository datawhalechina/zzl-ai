
const tableName = 'interviewee_record'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER, DATE, NOW } = Sequelize
    return await queryInterface.createTable(tableName, {
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
      interviewee_id: {
        type: INTEGER,
        allowNull: false,
        comment: '候选人外键'
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
        // 0 未进行面谈 1 一面 2 二面 3 三面 4 四面 5 电面 6 面试通过 7 发放 offer 8 正式入职 9 对方拒绝
        defaultValue: 0,
        validate: {
          min: 0,
          max: 15
        }
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
      },
      version: {
        type: INTEGER,
        allowNull: true,
        comment: '记录版本'
      }
    }, {
      paranoid: true,
      deletedAt: true,
      underscored: true,
      freezeTableName: true,
      tableName: tableName,
      version: true,
      comment: '面试记录表'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName)
  }
}
