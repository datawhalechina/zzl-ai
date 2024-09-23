import { request } from 'ice'
import { IResponseType, IPaginationParam } from './api'
import { upload } from './util'

const BASE_REQ_URL = '/interviewee/'

export const EINTERVIEWEE_TYPE = ['', '社招', '校招']

export interface IIntervieweesProps {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  education?: string;
  type?: number;
  intervieweeId?: number;
  isInternship?: number;
  jobId?: number;
  jobName?: string;
  resumePath?: string;
  reason?: string;
  note?: string;
  file?: File;
  channel?: number;
  state?: number;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  recommenderId?: number;
  recommenderName?: string;
  viewerId?: number;
  viewerName?: string;
  step?: number;
  stepName?: string;
}

export async function getAllInterviewees() {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}`,
    method: 'GET',
  })
}
export async function getAllIntervieweesWithPage(data: IIntervieweesProps & IPaginationParam) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}page`,
    method: 'POST',
    data,
  })
}
export async function getInterviewee(intervieweeId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${intervieweeId}`,
    method: 'GET',
  })
}

export async function addInterviewee(data: IIntervieweesProps, file) {
  return upload({ action: `${BASE_REQ_URL}upload`, data, file })
}

export async function editInterviewee(intervieweeId: number, data: IIntervieweesProps) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${intervieweeId}`,
    method: 'PUT',
    data,
  })
}

export async function deleteInterviewee(intervieweeId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${intervieweeId}`,
    method: 'DELETE',
  })
}
