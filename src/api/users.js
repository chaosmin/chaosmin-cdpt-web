import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/users/page',
    method: 'get',
    params: query
  })
}
