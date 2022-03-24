export const NotFoundRouteName = Symbol('NotFound')
export const ParentRouteName = Symbol('ParentLayoutRoute')

export enum PageEnum {
  Root = '/',
  Login = '/login',
  Dashboard = '/dashboard',
  NotFound = '/404',
  Forbidden = '/403',
}

export enum PageTitleEnum {
  Login = '登录',
  Dashboard = '工作台',
  NotFound = '无法找到此页面',
  Forbidden = '访问被拒绝',
}
