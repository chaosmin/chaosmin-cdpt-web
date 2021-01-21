import request from '@/utils/request'

export function fetchGoodsCategories() {
  return request({
    url: '/v1/api/insure/goods-categories',
    method: 'get'
  })
}

export function fetchGoods(query) {
  return request({
    url: '/v1/api/insure/goods',
    method: 'get',
    params: query
  })
}

export function issuePolicy(data) {
  return request({
    url: '/v1/api/insure',
    method: 'POST',
    data
  })
}
