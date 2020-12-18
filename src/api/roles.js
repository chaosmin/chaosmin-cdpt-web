import request from '@/utils/request'

export function fetchRole(query) {
  return request({
    url: '/v1/api/roles',
    method: 'GET',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/v1/api/roles',
    method: 'POST',
    data
  })
}
