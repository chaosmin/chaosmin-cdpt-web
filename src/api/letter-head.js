import request from '@/utils/request'

export function fetchByUser(id) {
  return request({
    url: `/v1/api/letter-head/user/${id}`,
    method: 'GET'
  })
}
