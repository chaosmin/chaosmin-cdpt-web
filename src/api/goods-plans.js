import request from '@/utils/request'

export function getOneGoodsPlan(id) {
  return request({
    url: `/v1/api/goods-plans/${id}`,
    method: 'GET'
  })
}

export function fetchGoodsPlan(query) {
  return request({
    url: '/v1/api/goods-plans',
    method: 'GET',
    params: query
  })
}

export function createGoodsPlan(data) {
  return request({
    url: '/v1/api/goods-plans',
    method: 'POST',
    data
  })
}

export function updateGoodsPlan(id, data) {
  return request({
    url: `/v1/api/goods-plans/${id}`,
    method: 'PUT',
    data
  })
}

export function removeGoodsPlan(id) {
  return request({
    url: `/v1/api/goods-plans/${id}`,
    method: 'DELETE'
  })
}

export function fetchUserCategories(id) {
  return request({
    url: `/v1/api/goods-plans/users/${id}/categories`,
    method: 'get'
  })
}

export function fetchUserGoods(id, query) {
  return request({
    url: `/v1/api/goods-plans/users/${id}`,
    method: 'get',
    params: query
  })
}
