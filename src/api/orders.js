import request from '@/utils/request'

export function fetchOrder(query) {
  return request({
    url: '/v1/api/orders',
    method: 'GET',
    params: query
  })
}
