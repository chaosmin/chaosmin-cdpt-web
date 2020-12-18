import request from '@/utils/request'

export function fetchUser(query) {
  return request({
    url: '/v1/api/users',
    method: 'GET',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/v1/api/users',
    method: 'POST',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: `/v1/api/users/${id}`,
    method: 'PUT',
    data
  })
}
