import request from '@/utils/request'

export function fetchPlan(query) {
  return request({
    url: '/v1/api/product-plans',
    method: 'GET',
    params: query
  })
}

export function fetchContract() {
  return request({
    url: '/v1/api/product-plans/contract',
    method: 'GET'
  })
}

export function createPlan(data) {
  return request({
    url: '/v1/api/product-plans',
    method: 'POST',
    data
  })
}

export function updatePlan(id, data) {
  return request({
    url: `/v1/api/product-plans/${id}`,
    method: 'PUT',
    data
  })
}

export function deletePlan(id) {
  return request({
    url: `/v1/api/product-plans/${id}`,
    method: 'DELETE'
  })
}
