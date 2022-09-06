import type { RouteRecordRaw } from 'vue-router'
import { ExceptionComponent, ParentLayout } from '../contants'
import { t } from '/@/composables/core/useTransl'
import { NotFoundRouteName, PageEnum, RedirectRouteName } from '/@/enums/pageEnum'
import { toHump } from '/@/utils'

/**
 * @description notfound route
 */
export const NotFoundRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: NotFoundRouteName,
  component: ParentLayout,
  meta: {
    hidden: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: NotFoundRouteName,
      component: ExceptionComponent,
      meta: {
        title: '404',
      },
    },
  ],
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
      name: RedirectRouteName,
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

const ExceptionRoute: RouteRecordRaw = {
  path: PageEnum.Error,
  name: toHump(PageEnum.Error),
  component: ParentLayout,
  redirect: `${PageEnum.Error}/404`,
  meta: {
    hidden: true,
  },
  children: [
    {
      path: '403',
      name: 'error403',
      component: ExceptionComponent,
      meta: {
        title: '403',
      },
      props: {
        status: 403,
      },
    },
    {
      path: '404',
      name: 'error404',
      component: ExceptionComponent,
      meta: {
        title: '404',
      },
      props: {
        status: 404,
      },
    },
    {
      path: '500',
      name: 'error500',
      component: ExceptionComponent,
      meta: {
        title: '500',
      },
      props: {
        status: 500,
      },
    },
  ],
}

/**
 * @description basic routing without permission
 */
export const basicRoutes: RouteRecordRaw[] = [
  LoginRoute,
  RedirectRoute,
  DashboardRoute,
  ProfileRoute,
  ExceptionRoute,
]
