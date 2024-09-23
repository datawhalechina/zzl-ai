import { request } from 'ice'
import { IPaginationParam, IResponseType } from './api'

const BASE_REQ_URL = '/intervieweeRecord/'

export interface IRecordsProps {
  id?: number;
  viewerId?: number;
  viewerName?: string;
  intervieweeId?: number;
  intervieweeName?: string;
  step?: number;
  stepName?: string;
  comment?: string;
  state?: number;
  type?: number;
}

export async function getAllRecords() {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}`,
    method: 'GET',
  })
}
export async function getAllRecordsWithPage(data: IRecordsProps & IPaginationParam) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}page`,
    method: 'POST',
    data,
  })
}
export async function getRecord(recordId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${recordId}`,
    method: 'GET',
  })
}
export async function goNext(recordId: number, data: IRecordsProps) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}next/${recordId}`,
    method: 'POST',
    data,
  })
}
export async function getAllProcessById(intervieweeId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}steps/${intervieweeId}`,
    method: 'GET',
  })
}

export async function addRecord(data: IRecordsProps) {
  return request<IResponseType>({
    url: BASE_REQ_URL,
    method: 'POST',
    data,
  })
}

export async function editRecord(recordId: number, data: IRecordsProps) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${recordId}`,
    method: 'PUT',
    data,
  })
}

export async function deleteRecord(recordId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${recordId}`,
    method: 'DELETE',
  })
}
