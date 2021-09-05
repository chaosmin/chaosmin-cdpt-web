import request from '@/utils/request'

export function testPay() {
  return request({
    url: 'api/wechatpay',
    method: 'get'
  })
}
