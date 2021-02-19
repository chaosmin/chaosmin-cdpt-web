import request from '@/utils/request'

export function getOneRole(id) {
  return request({
    url: `/v1/api/roles/${id}`,
    method: 'GET'
  })
}

export function fetchAuthorityOfRole(id) {
  return request({
    url: `/v1/api/roles/${id}/authorities`,
    method: 'GET'
  })
}

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

export function updateRole(id, data) {
  return request({
    url: `/v1/api/roles/${id}`,
    method: 'PUT',
    data
  })
}
