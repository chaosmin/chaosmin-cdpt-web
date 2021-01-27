import request from '@/utils/request'

export function fetchPolicy(query) {
  return request({
    url: '/v1/api/policies',
    method: 'GET',
    params: query
  })
}
