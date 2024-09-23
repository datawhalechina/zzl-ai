import { request } from 'ice'
import { IPaginationParam, IResponseType } from './api'

const BASE_REQ_URL = '/bu/'

export interface IBusProps {
  id?: number;
  name?: string;
}

export async function getAllBus() {
  return request<IResponseType>({
    url: BASE_REQ_URL,
    method: 'GET',
  })
}

export async function getAllBusWithPage(params: IBusProps & IPaginationParam) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}page`,
    method: 'GET',
    params,
  })
}
export async function getBu(buId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${buId}`,
    method: 'GET',
  })
}
export async function addBu(data: IBusProps) {
  return request<IResponseType>({
    url: BASE_REQ_URL,
    method: 'POST',
    data,
  })
}

export async function editBu(buId: number, data: IBusProps) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${buId}`,
    method: 'PUT',
    data,
  })
}

export async function deleteBu(buId: number) {
  return request<IResponseType>({
    url: `${BASE_REQ_URL}${buId}`,
    method: 'DELETE',
  })
}
