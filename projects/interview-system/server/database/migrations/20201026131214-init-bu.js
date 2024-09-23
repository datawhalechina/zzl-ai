const tableName = 'bu'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, NOW } = Sequelize
    await queryInterface.createTable(tableName, {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键，自增',
        unique: true
      },
      name: {
        type: STRING,
        unique: true,
        allowNull: false,
        comment: '部门名称'
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
      timestamps: true,
      deletedAt: true,
      underscored: true,
      freezeTableName: true,
      tableName: tableName,
      version: true,
      comment: '部门表'
    })
  },
  down: async queryInterface => {
    await queryInterface.dropTable(tableName)
  }
}
