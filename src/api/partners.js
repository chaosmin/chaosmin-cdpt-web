import request from '@/utils/request'

export function fetchPartner(query) {
  return request({
    url: '/v1/api/partners',
    method: 'GET',
    params: query
  })
}

export function createPartner(data) {
  return request({
    url: '/v1/api/partners',
    method: 'POST',
    data
  })
}

export function updatePartner(id, data) {
  return request({
    url: `/v1/api/partners/${id}`,
    method: 'PUT',
    data
  })
}
