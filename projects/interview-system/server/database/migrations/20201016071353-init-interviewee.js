
const tableName = 'interviewee'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER, DATE, NOW } = Sequelize
    return await queryInterface.createTable(tableName, {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键，自增'
      },
      name: {
        type: STRING,
        allowNull: false,
        comment: '候选人姓名'
      },
      phone: {
        type: STRING,
        allowNull: false,
        unique: 'intervieweePhone',
        is: /^1[3456789]\d{9}$/,
        comment: '候选人电话号码'
      },
      email: {
        type: STRING,
        allowNull: true,
        comment: '候选人电子邮箱',
        isEmail: true
      },
      address: {
        type: STRING,
        allowNull: false,
        comment: '候选人地址'
      },
      education: {
        type: STRING,
        allowNull: false,
        comment: '候选人学历,一般为 高中,大专,本科,研究生,博士,其他'
      },
      type: {
        type: INTEGER(1),
        comment: '招聘类型,0 社招,1校招,默认 0',
        defaultValue: 0
      },
      is_internship: {
        type: INTEGER(1),
        comment: '是否实习 0 试用 1 实习,默认 0',
        defaultValue: 0
      },
      job_id: {
        type: INTEGER,
        allowNull: true,
        comment: '推荐岗位外键'
      },
      reason: {
        type: STRING,
        allowNull: false,
        comment: '推荐理由'
      },
      resume_path: {
        type: STRING,
        allowNull: false,
        comment: '简历路径'
      },
      note: {
        type: STRING,
        allowNull: true,
        comment: '推荐备注'
      },
      channel: {
        type: INTEGER,
        allowNull: false,
        comment: '招聘渠道 0 外部 1 内部,默认 0',
        defaultValue: 1
      },
      status: {
        type: STRING,
        allowNull: false,
        comment: '面试状态,一面,二面,三面,四面,五面,六面,发放 offer,正式入职'
      },
      state: {
        type: INTEGER(1),
        defaultValue: 1,
        comment: '数据是否有效,0 无效,1 有效,默认 1'
      },
      is_success: {
        type: INTEGER(1),
        defaultValue: 0,
        comment: '是否成功 0 不成功 1 成功'
      },
      viewer_id: {
        type: INTEGER,
        allowNull: true,
        comment: '面试官外键'
      },
      recommender_id: {
        type: INTEGER,
        allowNull: false,
        comment: '内推人外键'
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
      comment: '候选人表'
    })
      .then(() => {
        queryInterface.addIndex(tableName, {
          name: 'name_index',
          fields: ['name']
        })
        queryInterface.addIndex(tableName, {
          name: 'phone_index',
          fields: ['phone']
        })
        queryInterface.addIndex(tableName, {
          name: 'status_index',
          fields: ['status']
        })
      })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName)
  }
}
