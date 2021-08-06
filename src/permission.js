import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { fetchUserCategories } from '@/api/goods-plans'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// 动态导航境内导航
function asyncPushRoutes(userId) {
  return fetchUserCategories(userId).then(({ data }) => {
    console.log(data)
    sessionStorage.setItem('addRoute', JSON.stringify(routeList(data, false)))
    return routeList(data, false, '')
    function routeList(data, children, id) {
      console.log(data)
      var routeArr = []
      if (data) {
        data.forEach((i, index) => {
          routeArr.push({
            path: !children ? '/insured' : `/insured/${index}`,
            props: !children ? '' : { selfId: i.id, parentId: id },
            name: !children ? 'Insured' : `Insured${index}`,
            component: !children ? Layout : resolve => require.ensure([], () => resolve(require('@/views/policy/insured')), 'Insured'),
            meta: { title: !children ? 'Insured' : `Insured${index}`, icon: !children ? 'el-icon-location' : 'el-icon-document-add' },
            children: i.children ? routeList(i.children, true, i.id) : []
          })
        })
      }
      return routeArr
    }
  })
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          const asyncRouteList = await asyncPushRoutes(store.getters.userId)
          console.log(asyncRouteList)
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          console.log(accessRoutes)
          console.log(asyncRouteList)
          // dynamically add accessible routes
          router.addRoutes(asyncRouteList.concat(accessRoutes))
          // console.log(router)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
