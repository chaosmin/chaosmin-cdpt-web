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
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
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
        component: () => import('@/views/dashboard/index'),
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
        component: () => import('@/views/profile/index'),
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
        component: () => import('@/views/partner/table'),
        name: 'Partner',
        meta: {
          title: 'Partner',
          icon: 'el-icon-suitcase',
          roles: ['administrator']
        }
      },
      {
        path: '/departments',
        component: () => import('@/views/department/table'),
        name: 'Department',
        meta: {
          title: 'Department',
          icon: 'tree',
          roles: ['administrator']
        }
      },
      {
        path: '/users',
        component: () => import('@/views/user/table'),
        name: 'User',
        meta: {
          title: 'User',
          icon: 'user',
          roles: ['administrator', 'manager']
        }
      },
      {
        path: '/roles',
        component: () => import('@/views/role/table'),
        name: 'Role',
        meta: {
          title: 'Role',
          icon: 'eye-open',
          roles: ['administrator']
        }
      },
      {
        path: '/authorities',
        component: () => import('@/views/authority/table'),
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
      roles: ['administrator', 'officer']
    },
    children: [
      {
        path: '/productCategories',
        component: () => import('@/views/policy/insured'),
        name: 'ProductCategory',
        meta: {
          title: 'ProductCategory',
          icon: 'el-icon-crop',
          roles: ['administrator', 'officer']
        }
      },
      {
        path: '/products',
        component: () => import('@/views/policy/insured'),
        name: 'Product',
        meta: {
          title: 'Product',
          icon: 'component',
          roles: ['administrator', 'officer']
        }
      },
      {
        path: '/plans',
        component: () => import('@/views/policy/insured'),
        name: 'Plan',
        meta: {
          title: 'Plan',
          icon: 'list',
          roles: ['administrator', 'officer']
        }
      },
      {
        path: '/knowledge',
        component: () => import('@/views/policy/insured'),
        name: 'Knowledge',
        meta: {
          title: 'Knowledge',
          icon: 'documentation',
          roles: ['administrator', 'officer']
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
      roles: ['administrator', 'officer']
    },
    children: [
      {
        path: '/insured',
        component: () => import('@/views/policy/insured'),
        name: 'Insured',
        meta: {
          title: 'Insured',
          icon: 'el-icon-document-add',
          roles: ['administrator', 'officer']
        }
      },
      {
        path: '/policies',
        component: () => import('@/views/policy/page'),
        name: 'Policy',
        meta: {
          title: 'Policy',
          icon: 'el-icon-document-checked',
          roles: ['administrator', 'officer']
        }
      },
      {
        path: '/orders',
        component: () => import('@/views/policy/page'),
        name: 'Order',
        meta: {
          title: 'Order',
          icon: 'el-icon-document',
          roles: ['administrator', 'officer']
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
      roles: ['administrator', 'officer']
    },
    children: [
      {
        path: '/debitNotes',
        component: () => import('@/views/policy/insured'),
        name: 'DebitNote',
        meta: {
          title: 'DebitNote',
          icon: 'el-icon-wallet',
          roles: ['administrator', 'officer']
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
