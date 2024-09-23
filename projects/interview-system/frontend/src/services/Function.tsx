import { request } from 'ice'
import { IPaginationParam, IResponseType } from './api'

const BASE_REQ_URL = '/functions/'

export interface IFunctionProps {
  buId?: number;
  buName?: string;
  name?: string;
  id?: number;
}

export async function getAllFns() {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}`,
    method: 'GET',
  })
}
export async function getAllFnsWithPage(data: IFunctionProps & IPaginationParam) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}page`,
    method: 'POST',
    data,
  })
}
export async function getFn(fnId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${fnId}`,
    method: 'GET',
  })
}
export async function getFnByBuId(buId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}bu/${buId}`,
    method: 'GET',
  })
}

export async function addFn(data: IFunctionProps) {
  return request<IResponseType>({
    url: BASE_REQ_URL,
    method: 'POST',
    data,
  })
}

export async function editFn(fnId: number, data: IFunctionProps) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${fnId}`,
    method: 'PUT',
    data,
  })
}

export async function deleteFn(fnId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${fnId}`,
    method: 'DELETE',
  })
}
