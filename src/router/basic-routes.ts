import type { RouteRecordRaw } from 'vue-router'
import { PageEnum } from '../enums/pageEnum'

/**
 * @description default layout
 */
export const LAYOUT = () => import('/@/layout/index.vue')

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
export const PageNotFoundRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'PageNotFound',
  component: () => import('/@/views/error/PageNotFound.vue'),
}

/**
 * @description basic routing without permission
 */
export const basicRoutes = [PageNotFoundRoute, LoginRoute]
