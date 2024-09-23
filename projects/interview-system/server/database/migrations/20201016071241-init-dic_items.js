
const tableName = 'sys_dic_items'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER, DATE, NOW } = Sequelize
    return await queryInterface.createTable(tableName, {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键'
      },
      name: {
        type: STRING(30),
        allowNull: false,
        comment: '字典名'
      },
      value: {
        type: STRING(30),
        allowNull: true,
        comment: '字典值'
      },
      note: {
        type: STRING(300),
        allowNull: true,
        comment: '字典备注'
      },
      group_name: {
        type: STRING(50),
        allowNull: false,
        comment: '字典分类'
      },
      sort_num: {
        type: INTEGER,
        allowNull: false,
        comment: '字典排序'
      },
      enable: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '字典是否启用，1 有效， 0 失效'
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
      comment: '数据字典记录表'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName)
  }
}
