const tableName = 'functions'

module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize

  const Functions = app.model.define(tableName, {
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
    }
  }, {
    tableName: tableName,
    comment: '职位表',
    hooks: {
    }
  })

  Functions.associate = () => {
    Functions.belongsTo(app.model.Bu, {
      as: 'bu',
      foreignKey: 'bu_id',
      constraints: false
    })
  }

  Functions.sync({ alter: true })
  return Functions
}
