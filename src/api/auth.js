import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/auth/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/user/logout',
    method: 'post'
  })
}
