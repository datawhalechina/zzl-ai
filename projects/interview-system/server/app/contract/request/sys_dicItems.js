
module.exports = {
  getSysDicGroupRequest: {
    groupName: { type: 'string', required: false, description: '字典分类' }
  },
  createSysDicRequest: {
    name: { type: 'string', required: true, description: '字典名' },
    value: { type: 'string', required: true, description: '字典值' },
    note: { type: 'string', required: false, description: '字典备注' },
    groupName: { type: 'string', required: true, description: '字典分类' },
    sortNum: {
      type: 'integer',
      required: true,
      convertType: 'number',
      description: '字典排序'
    },
    enable: {
      type: 'integer',
      required: false,
      convertType: 'number',
      default: 1,
      values: [0, 1],
      description: '字典是否启用'
    }
  },
  updateSysDicRequest: {
    name: { type: 'string', required: false, description: '字典名' },
    value: { type: 'string', required: false, description: '字典值' },
    note: { type: 'string', required: false, description: '字典备注' },
    groupName: { type: 'string', required: false, description: '字典分类' },
    sortNum: {
      type: 'integer',
      required: false,
      convertType: 'number',
      description: '字典排序'
    },
    enable: {
      type: 'integer',
      required: false,
      convertType: 'number',
      default: 1,
      values: [0, 1],
      description: '字典是否启用'
    }
  },
  findSysDicRequest: {
    name: { type: 'array', itemType: 'string', required: false, description: '字典名' },
    value: { type: 'array', itemType: 'string', required: false, description: '字典值' },
    note: { type: 'array', itemType: 'string', required: false, description: '字典备注' },
    groupName: { type: 'array', itemType: 'string', required: false, description: '字典分类' },
    sortNum: {
      type: 'integer',
      required: false,
      convertType: 'number',
      description: '字典排序'
    },
    enable: {
      type: 'integer',
      required: false,
      convertType: 'number',
      default: 1,
      values: [0, 1],
      description: '字典是否启用'
    }
  }
}
