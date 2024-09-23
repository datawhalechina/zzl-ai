const tableName = 'sys_dic_items'

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize

  const SysDicItems = app.model.define(tableName, {
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
    }
  }, {
    tableName: tableName,
    comment: '数据字典记录表',
    hooks: {
    }
  })

  return SysDicItems
}
