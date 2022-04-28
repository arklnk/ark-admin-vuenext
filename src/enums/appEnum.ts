import { TopMenuAlign } from '/#/config'

// refer to Bootstrap's responsive design
export const MOBILE_WIDTH = 768

//  Route switching animation
export enum RouterTransitionEnum {
  FADE = 'fade',
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}

export enum ContentEnum {
  FULL = 'full',
  FIXED = 'fixed',
}

export enum PermissionModeEnum {
  /**
   * 角色模式
   * 在前端固定写死路由的权限，指定路由有哪些权限可以查看。
   * 只初始化通用的路由，需要权限才能访问的路由没有被加入路由表内。
   * 在登陆后或者其他方式获取用户角色后，通过角色去遍历路由表，获取该角色可以访问的路由表，生成路由表，
   * 再通过 router.addRoutes 添加到路由实例，实现权限的过滤。
   */
  ROLE = 'ROLE',

  /**
   * 后台动态模式，配合sf-admin后端
   * 是通过接口动态生成路由表，且遵循一定的数据结构返回。前端根据需要处理该数据为可识别的结构，
   * 再通过 router.addRoutes 添加到路由实例，实现权限的动态生成。
   */
  BACK = 'BACK',
}

export const contentMap: Map<ContentEnum, string> = (() => {
  const map = new Map<ContentEnum, string>()
  map.set(ContentEnum.FULL, '流式')
  map.set(ContentEnum.FIXED, '定宽')
  return map
})()

export const topMenuAlignMap: Map<TopMenuAlign, string> = (() => {
  const map = new Map<TopMenuAlign, string>()
  map.set('flex-start', '居左')
  map.set('center', '居中')
  map.set('flex-end', '居右')
  return map
})()
