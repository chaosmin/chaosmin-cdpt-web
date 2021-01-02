import request from '@/utils/request'

export function fetchLiability(query) {
  return request({
    url: '/v1/api/plan-liabilities',
    method: 'GET',
    params: query
  })
}

export function updateLiability(id, data) {
  return request({
    url: `/v1/api/plan-liabilities/${id}`,
    method: 'PUT',
    data
  })
}

export function deleteLiability(id) {
  return request({
    url: `/v1/api/plan-liabilities/${id}`,
    method: 'DELETE'
  })
}
