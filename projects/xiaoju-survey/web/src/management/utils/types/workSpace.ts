export interface ListItem {
  value: string
  label: string
}

export interface MenuItem {
  id: string
  name: string
  icon?: string
  children?: MenuItem[]
}

export type IWorkspace = {
  _id?: string
  name: string
  description: string
  members: IMember[]
}

export type IMember = {
  userId: string
  username: string
  role: any
  _id?: string
}

export interface SpaceDetail {
  _id?: string
  name: string
  currentUserId?: string
  description: string
  members: IMember[]
}

export type SpaceItem = Required<Omit<SpaceDetail, 'members'>> & {
  createDate: string
  curStatus: { date: number; status: string }
  memberTotal: number
  currentUserRole: string
  owner: string
  ownerId: string
  surveyTotal: number
}

export enum SpaceType {
  Personal = 'personal',
  Group = 'group',
  Teamwork = 'teamwork'
}
export enum UserRole {
  Admin = 'admin',
  Member = 'user'
}

// 定义角色标签映射对象
export const roleLabels: Record<UserRole, string> = {
  [UserRole.Admin]: '管理员',
  [UserRole.Member]: '成员'
}

export interface ICollaborator {
  _id?: string
  userId: string
  username: string
  permissions: Array<number>
}

export enum SurveyPermissions {
  SurveyManage = 'SURVEY_CONF_MANAGE',
  DataManage = 'SURVEY_RESPONSE_MANAGE',
  CollaboratorManage = 'SURVEY_COOPERATION_MANAGE'
}
// 定义协作者权限标签映射对象
export const surveyPermissionsLabels: Record<SurveyPermissions, string> = {
  [SurveyPermissions.SurveyManage]: '问卷管理',
  [SurveyPermissions.DataManage]: '数据管理',
  [SurveyPermissions.CollaboratorManage]: '协作管理'
}
