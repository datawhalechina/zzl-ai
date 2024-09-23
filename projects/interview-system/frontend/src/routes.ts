import UserLayout from '@/layouts/user_layout'
import BasicLayout from '@/layouts/basic_layout'
import SecurityLayout from '@/layouts/security_layout'
import WrapperPage from '@/components/wrapper_page'
import Login from '@/pages/Login'
import FeedbackForbidden from '@/pages/Feedback/Forbidden'
import FeedbackServerError from '@/pages/Feedback/server_error'
import FeedbackNotFound from '@/pages/Feedback/not_found'

import InterviewManage from '@/pages/Interview/Manage'
import InterviewDetail from '@/pages/Interview/Detail'
import ResumeUpload from '@/pages/Resume/Upload'
import ResumeManage from '@/pages/Resume/Manage'
import Job from '@/pages/System/Job'
import FunctionManage from '@/pages/System/Function'
import Organization from '@/pages/System/Organization'
import UserManage from '@/pages/System/user_manage'
import DicitemManage from '@/pages/System/dicitem_manage'

const routerConfig = [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/',
        redirect: '/user/login',
      },
    ],
  },
  {
    path: '/error/',
    component: UserLayout,
    children: [
      {
        path: '/403',
        component: FeedbackForbidden,
      },
      {
        path: '/404',
        component: FeedbackNotFound,
      },
      {
        path: '/500',
        component: FeedbackServerError,
      },
      {
        path: '/',
        redirect: '/error/404',
      },
    ],
  },
  {
    path: '/',
    component: SecurityLayout,
    children: [
      {
        path: '/',
        component: BasicLayout,
        children: [
          { path: '/interview/list', exact: true, component: InterviewManage, wrappers: [WrapperPage] },
          // { path: '/interview/analysis', exact: true, component: InterviewAnalysis, wrappers: [WrapperPage] },
          { path: '/interview/process/:id', exact: true, component: InterviewDetail, wrappers: [WrapperPage] },
          // { path: '/resume/analysis', exact: true, component: ResumeAnalysis, wrappers: [WrapperPage] },
          { path: '/resume/upload', exact: true, component: ResumeUpload, wrappers: [WrapperPage] },
          { path: '/resume/manage', exact: true, component: ResumeManage, wrappers: [WrapperPage] },
          { path: '/system/user', exact: true, component: UserManage, wrappers: [WrapperPage] },
          { path: '/system/job', exact: true, component: Job, wrappers: [WrapperPage] },
          { path: '/system/function', exact: true, component: FunctionManage, wrappers: [WrapperPage] },
          { path: '/system/organization', exact: true, component: Organization, wrappers: [WrapperPage] },
          { path: '/system/dicitem', exact: true, component: DicitemManage, wrappers: [WrapperPage] },
          {
            path: '/',
            exact: true,
            redirect: '/resume/upload',
          },
          {
            path: '/feedback/403',
            exact: true,
            component: FeedbackForbidden,
          },
          {
            path: '/feedback/404',
            exact: true,
            component: FeedbackNotFound,
          },
          {
            path: '/feedback/500',
            exact: true,
            component: FeedbackServerError,
          },
          {
            path: '*',
            redirect: '/feedback/404',
          },
        ],
      },
    ],
  },
]

export default routerConfig
