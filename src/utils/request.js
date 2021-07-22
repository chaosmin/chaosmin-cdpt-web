import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000
})

service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === undefined) {
      return response
    } else if (res.code !== 'SUCCESS') {
      if (res.code === 'SYS_10002') {
        Message({
          message: '用户名或密码错误, 请重新登录!',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (res.code === 'TOKEN_00001' || res.code === 'TOKEN_00002' || res.code === 'TOKEN_00000') {
        MessageBox.confirm('登录失败, 请重新尝试!', '登录失败', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        })
      } else {
        Message({
          message: res.msg || '系统异常, 请联系管理员!',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err: ' + error) // for debug
    Message({
      message: error.msg || '请求失败, 请稍后重试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
