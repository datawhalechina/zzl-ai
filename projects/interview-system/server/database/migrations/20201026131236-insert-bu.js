const tableName = 'bu'
const bu = ['技术部', '财务部', '人力部', '行政部', '公关部'].map((name, idx) => ({
  id: idx + 1,
  name,
  created_at: new Date(),
  updated_at: new Date()
}))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(tableName, bu, {})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName)
  }
}
