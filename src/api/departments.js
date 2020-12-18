import request from '@/utils/request'

export function fetchDepartment(query) {
  return request({
    url: '/v1/api/departments',
    method: 'GET',
    params: query
  })
}

export function createDepartment(data) {
  return request({
    url: '/v1/api/departments',
    method: 'POST',
    data
  })
}

export function updateDepartment(id, data) {
  return request({
    url: `/v1/api/departments/${id}`,
    method: 'PUT',
    data
  })
}
