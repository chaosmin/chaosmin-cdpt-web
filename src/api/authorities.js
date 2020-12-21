import request from '@/utils/request'

export function fetchAuthority(query) {
  return request({
    url: '/v1/api/authorities',
    method: 'GET',
    params: query
  })
}

export function fetchTree() {
  return request({
    url: '/v1/api/authorities/tree',
    method: 'GET'
  })
}

export function createAuthority(data) {
  return request({
    url: '/v1/api/authorities',
    method: 'POST',
    data
  })
}

export function updateAuthority(id, data) {
  return request({
    url: `/v1/api/authorities/${id}`,
    method: 'PUT',
    data
  })
}

export function deleteAuthority(id) {
  return request({
    url: `/v1/api/authorities/${id}`,
    method: 'DELETE'
  })
}
