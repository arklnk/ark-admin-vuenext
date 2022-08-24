export const NotFoundRouteName = Symbol('NotFound')

export enum PageEnum {
  Root = '/',
  Login = '/login',
  Dashboard = '/dashboard',
  NotFound = '/404',
  Forbidden = '/403',
  Account = '/account',
  Logout = '/logout',
}
