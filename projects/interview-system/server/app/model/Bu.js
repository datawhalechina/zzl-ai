const tableName = 'bu'

module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize

  const Bu = app.model.define(tableName, {
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
    }
  }, {
    tableName: tableName,
    comment: '部门表',
    hooks: {
    }
  })

  Bu.sync({ alter: true })
  return Bu
}
