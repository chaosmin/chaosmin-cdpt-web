import request from '@/utils/request'

export function getPersonalComsSet(params) {
  return request({
    url: '/v1/api/reports/personal-commission-settlement',
    method: 'GET',
    params
  })
}

export function downloadPersonalComsSet(params) {
  return request({
    url: '/v1/api/reports/personal-commission-settlement',
    method: 'POST',
    responseType: 'blob',
    params
  })
}

export function getBillingList(params) {
  return request({
    url: '/v1/api/reports/billing-list',
    method: 'GET',
    params
  })
}

export function downloadBillingList(params) {
  return request({
    url: '/v1/api/reports/billing-list',
    method: 'POST',
    responseType: 'blob',
    params
  })
}
