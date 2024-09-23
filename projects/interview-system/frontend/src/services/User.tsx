import { request } from 'ice'
import { IPaginationParam, IResponseType } from './api'

const BASE_REQ_URL = '/user/'
const BASE_LOGIN_REQ_URL = '/login/'

export interface ILoginParamsType {
  userName: string;
  password: string;
}
export interface IUserProps {
  buId?: number;
  buName?: string;
  functionId?: number;
  functionName?: string;
  createdAt?: string;
  id?: number;
  isLocked?: boolean;
  lockUntil?: number;
  loginAttempts?: number;
  name?: string;
  password?: string;
  passwd?: string;
  rePasswd?: string;
  phone?: string;
  roleType?: number;
  updatedAt?: string;
  auth?: {
    isLogin: boolean;
    isHunting: boolean;
    isManage: boolean;
    isInterview: boolean;
    isAdmin: boolean;
  };
}
export const EUserRoleType = ['招聘方', 'HR', '面试官', '系统管理员']

export async function accountLogin(params: ILoginParamsType) {
  return request<IResponseType>({
    url: BASE_LOGIN_REQ_URL,
    method: 'POST',
    data: params,
  })
}

export async function outLogin(userId?: number) {
  return request<IResponseType>({
    url: BASE_LOGIN_REQ_URL,
    method: 'DELETE',
    params: { userId },
  })
}

export async function queryCurrent() {
  return request<{ data: IUserProps }>({
    url: `${BASE_REQ_URL}current`,
    method: 'GET',
  })
}

export async function getAllUsers() {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}`,
    method: 'GET',
    params: { isInner: true },
  })
}
export async function getAllUsersWithPage(data: IUserProps & IPaginationParam) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}page`,
    method: 'POST',
    data,
  })
}
export async function getUser(userId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${userId}`,
    method: 'GET',
  })
}

export async function addUser(data: IUserProps) {
  return request<IResponseType>({
    url: BASE_REQ_URL,
    method: 'POST',
    data,
  })
}

export async function editUser(userId: number, data: IUserProps) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${userId}`,
    method: 'PUT',
    data,
  })
}

export async function deleteUser(userId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${userId}`,
    method: 'DELETE',
  })
}

export async function unlockUser(userId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}unlock/${userId}`,
    method: 'PUT',
  })
}

export async function lockUser(userId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}lock/${userId}`,
    method: 'PUT',
  })
}
export const formatUserByBu = (item: IUserProps): [string, number | void] | string[] | string | void => [
  `${item.buName}/${item.name}`,
  item.id,
]
