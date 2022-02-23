import type { RouteRecordRaw } from 'vue-router'
import { PageEnum } from '../enums/pageEnum'

/**
 * @description default layout
 */
export const ParentLayout = () => import('/@/layout/index.vue')

/**
 * @description empty layout
 */
export const EmptyLayout = () => import('/@/layout/EmptyLayout.vue')

/**
 * @description login page route
 */
export const LoginRoute: RouteRecordRaw = {
  path: PageEnum.Login,
  name: 'Login',
  component: () => import('/@/views/login/Login.vue'),
}

/**
 * @description 404 page route
 */
export const Error404Route: RouteRecordRaw = {
  path: PageEnum.NotFound,
  name: 'Error404',
  component: () => import('/@/views/error/Error404.vue'),
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
export const basicRoutes = [NotFoundRoute, LoginRoute, Error404Route]
