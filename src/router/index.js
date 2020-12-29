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
      roles: ['administrator', 'manager']
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
        path: '/departments',
        component: resolve => require.ensure([], () => resolve(require('@/views/department/table')), 'Department'),
        name: 'Department',
        meta: {
          title: 'Department',
          icon: 'tree',
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
          roles: ['administrator', 'manager']
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
      roles: ['administrator']
    },
    children: [
      {
        path: '/product-categories',
        component: resolve => require.ensure([], () => resolve(require('@/views/product-category/table')), 'ProductCategory'),
        name: 'ProductCategory',
        meta: {
          title: 'ProductCategory',
          icon: 'el-icon-crop',
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
      roles: ['administrator', 'manager', 'officer']
    },
    children: [
      {
        path: '/policies',
        name: 'Policy',
        meta: {
          title: 'Policy',
          icon: 'el-icon-document-checked',
          roles: ['administrator', 'manager', 'officer']
        }
      },
      {
        path: '/orders',
        name: 'Order',
        meta: {
          title: 'Order',
          icon: 'el-icon-document',
          roles: ['administrator', 'manager', 'officer']
        }
      }
    ]
  },
  {
    path: '/insured',
    component: Layout,
    meta: { roles: ['administrator', 'officer'] },
    children: [
      {
        path: 'index',
        component: resolve => require.ensure([], () => resolve(require('@/views/policy/insured')), 'Insured'),
        name: 'Insured',
        meta: { title: 'Insured', icon: 'el-icon-document-add', roles: ['administrator', 'officer'] }
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
      roles: ['administrator']
    },
    children: [
      {
        path: '/debitNotes',
        name: 'DebitNote',
        meta: {
          title: 'DebitNote',
          icon: 'el-icon-wallet',
          roles: ['administrator']
        }
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
