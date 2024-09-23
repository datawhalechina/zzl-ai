const tableName = 'functions'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, NOW } = Sequelize
    await queryInterface.createTable(tableName, {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键，自增'
      },
      name: {
        type: STRING,
        allowNull: false,
        comment: '职能名称'
      },
      bu_id: {
        type: INTEGER,
        allowNull: true,
        comment: 'bu表主键'
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
      comment: '职位表'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName)
  }
}
