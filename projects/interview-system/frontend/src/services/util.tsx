import { request, logger } from 'ice'
import { IResponseType } from './api'

export const upload = async ({ action, data, headers = {}, file, withCredentials = true }): Promise<IResponseType> => {
  const formData = new window.FormData()
  Object.keys(data).forEach((key) => {
    const val = data[key]
    key !== 'file' && formData.append(key, val)
  })
  formData.append('file', file.originFileObj)
  return request({
    method: 'POST',
    url: action,
    data: formData,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data;',
    },
    withCredentials,
    timeout: 120000,
  })
    .then((res: IResponseType) => {
      return res
    })
    .catch((err) => {
      try {
        logger.log(err.errorResponse || err.subCode || err.message || err)
      } catch (error) {
        logger.error('网络异常', error)
      }
      throw err
    })
}
