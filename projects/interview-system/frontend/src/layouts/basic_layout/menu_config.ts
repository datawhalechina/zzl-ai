const headerMenuConfig = [{ path: '/resume/upload', icon: 'smile', name: '新增简历' }]

const asideMenuConfig = [
  {
    name: '面试管理',
    icon: 'smile',
    children: [
      // { path: '/interview/analysis', name: '面试情况分析', auth: ['isInterview', 'isManage', 'isAdmin'] },
      { path: '/interview/list', name: '面试列表', auth: ['isManage', 'isAdmin'] },
    ],
  },
  {
    name: '简历管理',
    icon: 'smile',
    children: [
      // { path: '/resume/analysis', name: '简历分析' },
      { path: '/resume/upload', name: '简历上传' },
      { path: '/resume/manage', name: '简历安排', auth: ['isManage', 'isAdmin'] },
    ],
  },
  {
    name: '系统管理',
    icon: 'smile',
    children: [
      { path: '/system/dicitem', name: '字典管理', auth: ['isAdmin'] },
      { path: '/system/user', name: '用户管理', auth: ['isManage', 'isAdmin'] },
      { path: '/system/organization', name: '部门管理', auth: ['isAdmin'] },
      { path: '/system/function', name: '岗位管理', auth: ['isManage', 'isAdmin'] },
      { path: '/system/job', name: '职位管理', auth: ['isManage', 'isAdmin'] },
    ],
  },
]

export { headerMenuConfig, asideMenuConfig }
