import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: resolve => require.ensure([], () => resolve(require('@/views/dashboard/index')), 'dashboard'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: resolve => require.ensure([], () => resolve(require('@/views/profile/index')), 'Profile'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/admin',
    component: Layout,
    alwaysShow: true,
    name: 'Admin',
    meta: {
      title: 'Admin',
      icon: 'peoples',
      roles: ['administrator', 'sales', 'manager']
    },
    children: [
      {
        path: '/departments',
        component: resolve => require.ensure([], () => resolve(require('@/views/department/table')), 'Department'),
        name: 'Department',
        meta: {
          title: 'Department',
          icon: 'user',
          roles: ['administrator']
        }
      },
      {
        path: '/users',
        component: resolve => require.ensure([], () => resolve(require('@/views/user/table')), 'User'),
        name: 'User',
        meta: {
          title: 'User',
          icon: 'user',
          roles: ['administrator', 'sales', 'manager']
        }
      },
      {
        path: '/roles',
        component: resolve => require.ensure([], () => resolve(require('@/views/role/table')), 'Role'),
        name: 'Role',
        meta: {
          title: 'Role',
          icon: 'eye-open',
          roles: ['administrator']
        }
      },
      {
        path: '/authorities',
        component: resolve => require.ensure([], () => resolve(require('@/views/authority/table')), 'Authority'),
        name: 'Authority',
        meta: {
          title: 'Authority',
          icon: 'lock',
          roles: ['administrator']
        }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    alwaysShow: true,
    name: 'ProductCenter',
    meta: {
      title: 'ProductCenter',
      icon: 'el-icon-collection',
      roles: ['administrator', 'sales', 'manager']
    },
    children: [
      {
        path: '/partners',
        component: resolve => require.ensure([], () => resolve(require('@/views/partner/table')), 'Partner'),
        name: 'Partner',
        meta: {
          title: 'Partner',
          icon: 'el-icon-suitcase',
          roles: ['administrator']
        }
      },
      {
        path: '/products',
        component: resolve => require.ensure([], () => resolve(require('@/views/product/table')), 'Product'),
        name: 'Product',
        meta: {
          title: 'Product',
          icon: 'component',
          roles: ['administrator']
        }
      },
      {
        path: '/plans',
        component: resolve => require.ensure([], () => resolve(require('@/views/product-plan/table')), 'Plan'),
        name: 'Plan',
        meta: {
          title: 'Plan',
          icon: 'list',
          roles: ['administrator']
        }
      },
      {
        path: '/plan-liabilities',
        component: resolve => require.ensure([], () => resolve(require('@/views/plan-liability/table')), 'Liability'),
        name: 'Liability',
        hidden: true,
        meta: {
          title: 'Liability',
          roles: ['administrator']
        }
      },
      {
        path: '/plan-rate-table',
        component: resolve => require.ensure([], () => resolve(require('@/views/plan-rate-table/table')), 'RateTable'),
        name: 'RateTable',
        hidden: true,
        meta: {
          title: 'RateTable',
          roles: ['administrator']
        }
      },
      {
        path: '/product-authorization',
        component: resolve => require.ensure([], () => resolve(require('@/views/goods-plan/table')), 'ProductAuthorization'),
        name: 'ProductAuthorization',
        meta: {
          title: 'ProductAuthorization',
          icon: 'el-icon-s-check',
          roles: ['administrator', 'sales', 'manager']
        }
      }
    ]
  },
  {
    path: '/policy',
    component: Layout,
    alwaysShow: true,
    name: 'PolicyMgmt',
    meta: {
      title: 'PolicyMgmt',
      icon: 'el-icon-document-copy',
      roles: ['administrator', 'sales', 'manager', 'officer']
    },
    children: [
      {
        path: '/orders',
        component: resolve => require.ensure([], () => resolve(require('@/views/order/table')), 'Order'),
        name: 'Order',
        meta: {
          title: 'Order',
          icon: 'el-icon-document',
          roles: ['administrator', 'sales', 'manager', 'officer']
        }
      },
      {
        path: '/policies',
        component: resolve => require.ensure([], () => resolve(require('@/views/policy/table')), 'Policy'),
        name: 'Policy',
        meta: {
          title: 'Policy',
          icon: 'el-icon-document-checked',
          roles: ['administrator', 'sales', 'manager', 'officer']
        }
      },
      {
        path: '/policy-detail',
        component: resolve => require.ensure([], () => resolve(require('@/views/policy/detail')), 'PolicyDetail'),
        name: 'PolicyDetail',
        hidden: true,
        meta: {
          title: 'PolicyDetail',
          roles: ['administrator', 'sales', 'manager', 'officer']
        }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    alwaysShow: true,
    name: 'Report',
    meta: {
      title: 'Report',
      icon: 'el-icon-tickets',
      roles: ['administrator', 'sales', 'manager']
    },
    children: [
      {
        path: '/sltCheck',
        component: resolve => require.ensure([], () => resolve(require('@/views/report/sltcheck')), 'SltCheck'),
        name: 'SltCheck',
        meta: { title: 'SltCheck', icon: 'el-icon-wallet', roles: ['administrator'] }
      },
      {
        path: '/sltComs',
        component: resolve => require.ensure([], () => resolve(require('@/views/report/sltcoms')), 'SltComs'),
        name: 'SltComs',
        meta: { title: 'SltComs', icon: 'el-icon-wallet', roles: ['administrator', 'sales', 'manager'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
