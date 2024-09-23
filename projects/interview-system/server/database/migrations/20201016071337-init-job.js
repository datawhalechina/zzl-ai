
const tableName = 'job'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER, DATE, NOW, TEXT } = Sequelize
    return await queryInterface.createTable(tableName, {
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
      comment: '岗位表'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName)
  }
}
