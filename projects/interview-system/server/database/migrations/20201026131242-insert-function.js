const tableName = 'functions'
const functions = ['技术', '产品', '运营', '人力资源', '销售', '行政', '财务', '物流'].map((name, idx) => ({
  id: idx + 1,
  bu_id: 1,
  name,
  created_at: new Date(),
  updated_at: new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(tableName, functions, {})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName)
  }
}
