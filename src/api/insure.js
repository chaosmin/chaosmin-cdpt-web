import request from '@/utils/request'

export function getBizNo() {
  return request({
    url: 'v1/api/insure/biz-no',
    method: 'get'
  })
}

export function issuePolicy(data) {
  return request({
    url: '/v1/api/insure',
    method: 'POST',
    data
  })
}

export function saveKhsImg(orderNo, data) {
  return request({
    url: `/v1/api/insure/${orderNo}/khs`,
    method: 'POST',
    data
  })
}
