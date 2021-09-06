import request from '@/utils/request'

export function fetchOrder(query) {
  return request({
    url: '/v1/api/orders',
    method: 'GET',
    params: query
  })
}

export function deleteOrder(id) {
  return request({
    url: `/v1/api/orders/${id}`,
    method: 'DELETE'
  })
}

export function createPayment(orderNo) {
  return request({
    url: `/v1/api/orders/${orderNo}/pay`,
    method: 'GET'
  })
}

export function saveOrderTrace(orderNo, data) {
  return request({
    url: `/v1/api/orders/${orderNo}/trace`,
    method: 'POST',
    data
  })
}

export function loadDraft(orderNo) {
  return request({
    url: `/v1/api/orders/${orderNo}/draft-box`,
    method: 'GET'
  })
}

export function saveDraft(orderNo, data) {
  return request({
    url: `/v1/api/orders/${orderNo}/draft-box`,
    method: 'POST',
    data
  })
}
