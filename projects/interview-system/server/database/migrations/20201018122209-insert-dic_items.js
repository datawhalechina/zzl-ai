const tableName = 'sys_dic_items'

const RESUME_ORIGIN_ARR = ['社招', '校招']
const INTERVIEWEE_STATUS_ARR = ['一面', '二面', '三面', '四面', '五面', '六面', '发放 offer', '正式入职']
const INTERVIEWEE_TYPE_ARR = ['现场面试', '电话面试', '视频面试', '其他']
const EDUCATION_STATUS_ARR = ['高中', '本科', '研究生', '博士', '其他']
const STATUS_ARR = ['禁用', '启用']
const ROLE_TYPE_ARR = ['外部猎头', '面试官', '部门经理', '超级管理者']

const getDicItemByName = ({ name, type, note, id, idx }) => ({
  id,
  name,
  value: idx,
  group_name: type,
  note: note,
  sort_num: idx + 1,
  enable: 1,
  created_at: new Date(),
  updated_at: new Date()
})

const getDicData = () => {
  const baseArr = [{
    type: 'RESUME_ORIGIN',
    note: '招聘类型',
    data: RESUME_ORIGIN_ARR
  }, {
    type: 'INTERVIEWEE_STATUS',
    note: '面试流程',
    data: INTERVIEWEE_STATUS_ARR
  }, {
    type: 'INTERVIEWEE_TYPE',
    note: '面试方式',
    data: INTERVIEWEE_TYPE_ARR
  }, {
    type: 'EDUCATION_STATUS',
    note: '候选人学历',
    data: EDUCATION_STATUS_ARR
  }, {
    type: 'STATUS',
    note: '状态管理',
    data: STATUS_ARR
  }, {
    type: 'ROLE_TYPE',
    note: '用户角色类型',
    data: ROLE_TYPE_ARR
  }]

  const res = []
  baseArr.forEach(item => {
    const { type, note, data } = item
    Array.isArray(data) && data.map((name, idx) => {
      res.push(getDicItemByName({ name, idx, type, note, id: res.length + 1 }))
    })
  })
  return res
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(tableName, getDicData(), {})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName)
  }
}
