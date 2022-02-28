import type { RouteRecordRaw } from 'vue-router'
import { PageEnum } from '../enums/pageEnum'

/**
 * @description default layout
 */
export const ParentLayout = () => import('/@/layout/index.vue')

/**
 * @description empty layout
 */
export const EmptyLayout = () => import('/@/layout/components/EmptyLayout.vue')

/**
 * @description login page route
 */
export const LoginRoute: RouteRecordRaw = {
  path: PageEnum.Login,
  name: 'Login',
  component: () => import('/@/views/login/Login.vue'),
  meta: {
    title: '登录',
  },
}

/**
 * @description 404 page route
 */
export const Error404Route: RouteRecordRaw = {
  path: PageEnum.NotFound,
  name: 'Error404',
  component: () => import('/@/views/error/Error404.vue'),
  meta: {
    title: '页面走丢了',
  },
}

/**
 * @description 404 page route
 */
export const Error403Route: RouteRecordRaw = {
  path: PageEnum.Forbidden,
  name: 'Error403',
  component: () => import('/@/views/error/Error403.vue'),
  meta: {
    title: '拒绝访问',
  },
}

/**
 * @description notfound route
 */
export const NotFoundRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'NotFound',
  redirect: PageEnum.NotFound,
}

/**
 * @description basic routing without permission
 */
export const basicRoutes = [NotFoundRoute, LoginRoute, Error404Route, Error403Route]
