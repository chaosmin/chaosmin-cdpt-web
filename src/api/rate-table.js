import request from '@/utils/request'

export function fetchRateTable(query) {
  return request({
    url: '/v1/api/product-plan-rate-table',
    method: 'GET',
    params: query
  })
}

export function updateRateTable(id, data) {
  return request({
    url: `/v1/api/product-plan-rate-table/${id}`,
    method: 'PUT',
    data
  })
}

export function deleteRateTable(id) {
  return request({
    url: `/v1/api/product-plan-rate-table/${id}`,
    method: 'DELETE'
  })
}
