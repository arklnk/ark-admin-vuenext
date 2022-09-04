import type { RouteRecordRaw } from 'vue-router'
import { ParentLayout } from '../contants'
import { t } from '/@/composables/core/useTransl'
import { NotFoundRouteName, PageEnum } from '/@/enums/pageEnum'
import { toHump } from '/@/utils'

/**
 * @description notfound route
 */
export const NotFoundRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: NotFoundRouteName,
  redirect: PageEnum.NotFound,
  meta: {
    hidden: true,
  },
}

/**
 * @description login page route
 */
export const LoginRoute: RouteRecordRaw = {
  path: PageEnum.Login,
  name: toHump(PageEnum.Login),
  component: () => import('/@/views/basic/login/Login.vue'),
  meta: {
    title: t('routes.login'),
    hidden: true,
  },
}

/**
 * @description 404 page route
 */
export const Error404Route: RouteRecordRaw = {
  path: PageEnum.NotFound,
  name: toHump(PageEnum.NotFound),
  component: () => import('/@/views/basic/error/Error404.vue'),
  meta: {
    title: t('routes.notfound'),
    hidden: true,
  },
}

/**
 * @description dashboard route
 */
export const DashboardRoute: RouteRecordRaw = {
  path: PageEnum.Root,
  name: toHump(PageEnum.Dashboard),
  component: ParentLayout,
  redirect: PageEnum.Dashboard,
  meta: {
    single: true,
  },
  children: [
    {
      path: PageEnum.Dashboard,
      component: () => import('/@/views/basic/dashboard/Dashboard.vue'),
      meta: {
        title: t('routes.dashboard'),
        icon: 'carbon:dashboard',
      },
    },
  ],
}

/**
 * @description redirect route
 */
const RedirectRoute: RouteRecordRaw = {
  path: '/redirect',
  name: 'RedirectTo',
  component: ParentLayout,
  meta: {
    hidden: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: 'Redirect',
      component: () => import('/@/views/basic/redirect/Redirect.vue'),
      meta: {
        title: t('routes.redirect'),
      },
    },
  ],
}

const ProfileRoute: RouteRecordRaw = {
  path: PageEnum.Account,
  name: toHump(PageEnum.Account),
  redirect: `${PageEnum.Account}/center`,
  component: ParentLayout,
  meta: {
    hidden: true,
  },
  children: [
    {
      path: 'center',
      name: toHump(`${PageEnum.Account}/center`),
      component: () => import('/@/views/basic/account/Account.vue'),
      meta: {
        title: t('routes.account'),
      },
    },
  ],
}

/**
 * @description basic routing without permission
 */
export const basicRoutes: RouteRecordRaw[] = [
  LoginRoute,
  Error404Route,
  RedirectRoute,
  DashboardRoute,
  ProfileRoute,
]
