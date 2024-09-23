import { request } from 'ice'
import { IPaginationParam, IResponseType } from './api'

const BASE_REQ_URL = '/job/'

export interface IJobsProps {
  id?: number;
  state?: string;
  name?: string;
  buId?: number;
  functionId?: number;
  description?: string;
  responsibility?: string;
}

export async function getAllJobs() {
  return request<IResponseType>({
    url: BASE_REQ_URL,
    method: 'GET',
  })
}
export async function getAllJobsWithPage(data: IJobsProps & IPaginationParam) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}page`,
    method: 'POST',
    data,
  })
}
export async function getJob(jobId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${jobId}`,
    method: 'GET',
  })
}
export async function findJob(data: IJobsProps) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}find`,
    method: 'POST',
    data,
  })
}

export async function addJob(data: IJobsProps) {
  return request<IResponseType>({
    url: BASE_REQ_URL,
    method: 'POST',
    data,
  })
}

export async function editJob(jobId: number, data: IJobsProps) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${jobId}`,
    method: 'PUT',
    data,
  })
}

export async function deleteJob(jobId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${jobId}`,
    method: 'DELETE',
  })
}
