import request from '@/utils/request'

export function fetchPolicy(query) {
  return request({
    url: '/v1/api/policies',
    method: 'GET',
    params: query
  })
}

export function cancelPolicy(id, data) {
  return request({
    url: `/v1/api/policies/${id}`,
    method: 'PUT',
    data
  })
}
