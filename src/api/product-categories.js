import request from '@/utils/request'

export function fetchCategory(query) {
  return request({
    url: '/v1/api/product-categories',
    method: 'GET',
    params: query
  })
}

export function createCategory(data) {
  return request({
    url: '/v1/api/product-categories',
    method: 'POST',
    data
  })
}

export function updateCategory(id, data) {
  return request({
    url: `/v1/api/product-categories/${id}`,
    method: 'PUT',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: `/v1/api/product-categories/${id}`,
    method: 'DELETE'
  })
}
