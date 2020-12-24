import request from '@/utils/request'

export function getOneProduct(id) {
  return request({
    url: `/v1/api/products/${id}`,
    method: 'GET'
  })
}

export function fetchProduct(query) {
  return request({
    url: '/v1/api/products',
    method: 'GET',
    params: query
  })
}

export function createProduct(data) {
  return request({
    url: '/v1/api/products',
    method: 'POST',
    data
  })
}

export function updateProduct(id, data) {
  return request({
    url: `/v1/api/products/${id}`,
    method: 'PUT',
    data
  })
}
