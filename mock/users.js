const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    username: '@first',
    loginName: '@first',
    phone: '',
    email: '',
    'status|1': ['init', 'active', 'freeze'],
    createTime: +Mock.Random.date('T'),
    creator: '@first',
    updateTime: +Mock.Random.date('T'),
    updater: '@first'
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/users/page',
    type: 'get',
    response: config => {
      const { username, loginName, phone, email, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (username && item.username !== +username) return false
        if (loginName && item.loginName !== loginName) return false
        if (phone && item.phone !== phone) return false
        if (email && item.email !== email) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]

