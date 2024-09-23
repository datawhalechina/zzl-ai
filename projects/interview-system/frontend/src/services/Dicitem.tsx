import { request } from 'ice'
import { IPaginationParam, IResponseType } from './api'

const BASE_REQ_URL = '/sysDicItems/'

export interface IDicItemProps {
  name?: string;
  id?: number;
  value?: string;
  groupName?: string | string[];
  note?: string;
  sortNum?: number;
  enable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAllDic() {
  return request<IResponseType>({
    url: BASE_REQ_URL,
    method: 'GET',
  })
}
export async function getAllDicWithPage(data: IDicItemProps & IPaginationParam) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}page`,
    method: 'POST',
    data,
  })
}
export async function getDic(dicId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${dicId}`,
    method: 'GET',
  })
}
export async function findDic(data: IDicItemProps) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}find`,
    method: 'POST',
    data,
  })
}
export async function getDicsByGroup(groupName: string) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}group/${groupName}`,
    method: 'GET',
  })
}

export async function addDic(data: IDicItemProps) {
  return request<IResponseType>({
    url: BASE_REQ_URL,
    method: 'POST',
    data,
  })
}

export async function editDic(dicId: number, data: IDicItemProps) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${dicId}`,
    method: 'PUT',
    data,
  })
}

export async function deleteDic(dicId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${dicId}`,
    method: 'DELETE',
  })
}

export class DicItem {
  // 面试状态
  static INTERVIEWEE_STATUS = 'INTERVIEWEE_STATUS'
  static INTERVIEWEE_STATUS_LIST = []
  // 简历来源
  static RESUME_ORIGIN = 'RESUME_ORIGIN'
  static RESUME_ORIGIN_LIST = []

  static EDUCATION_STATUS = 'EDUCATION_STATUS'
  static INTERVIEWEE_TYPE = 'INTERVIEWEE_TYPE'
  static STATUS = 'STATUS'
  static ROLE_TYPE = 'ROLE_TYPE'
}

/**
 *
 * @param {[{code, name}]} list
 * @param {number} id
 * @returns {string}
 */
function codeToName(list = [], id: number) {
  if (list.length) {
    const find = ((list as unknown) as [IDicItemProps]).find((item) => item.id === id)
    return find ? find?.name : '未定义状态'
  }
  return ''
}
/**
 * 获取code
 * @param {'INTERVIEWEE_STATUS' | 'RESUME_ORIGIN'} groupName
 * @param {boolean} refresh
 * @returns {Promise<[{code: number, name: string}]>}
 */
async function getCode(groupName: string, refresh = false) {
  const path = `${name}_LIST`
  const list = DicItem[path]
  if (list && list.length && !refresh) {
    return { data: list }
  }
  try {
    const res = await getDicsByGroup(groupName)
    res.data && (DicItem[path] = res.data)
  } catch (error) {
    DicItem[path] = []
  }
  return { data: DicItem[path] }
}

export async function getResumeOrignEnum(refresh = false) {
  return await getCode(DicItem.RESUME_ORIGIN, refresh)
}
export async function getIntervieweeStatusEnum(refresh = false) {
  return await getCode(DicItem.INTERVIEWEE_STATUS, refresh)
}

export async function tranResumeOrignName(dicId: number) {
  return await codeToName(DicItem.RESUME_ORIGIN_LIST, dicId)
}
export async function tranIntervieweeStatusName(dicId: number) {
  return await codeToName(DicItem.INTERVIEWEE_STATUS_LIST, dicId)
}

export const formatDicitems = (data) => {
  return (
    data &&
    data.reduce((prev, curr) => {
      !prev[curr.groupName] && (prev[curr.groupName] = [])
      prev[curr.groupName].push(curr)
      return prev
    }, {})
  )
}
