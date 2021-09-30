import request from '@/utils/request'

export function getOneTrans(id) {
  return request({
    url: `/v1/api/payment-trans/${id}`,
    method: 'GET'
  })
}
