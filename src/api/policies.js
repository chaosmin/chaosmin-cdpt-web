import request from '@/utils/request'

export function getPolicyDetail(orderNo) {
  return request({
    url: `/v1/api/policies/${orderNo}/detail`,
    method: 'GET'
  })
}

export function fetchPolicy(query) {
  return request({
    url: '/v1/api/policies',
    method: 'GET',
    params: query
  })
}

export function fetchPolicyKhs(id) {
  return request({
    url: `/v1/api/policies/${id}/khs`,
    method: 'GET'
  })
}

export function cancelPolicy(id, data) {
  return request({
    url: `/v1/api/policies/${id}`,
    method: 'PUT',
    data
  })
}
