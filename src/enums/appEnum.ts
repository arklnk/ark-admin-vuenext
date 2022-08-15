import { t } from '/@/composables/core/useTransl'
import type { TopMenuAlign } from '/#/config'

export const SIDE_BAR_COLLAPSED_WIDTH = 64

// menu theme enum
export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

// 夜间模式下的mix color，如果覆写了element-plus中的值也需要一并修改这个值
/**
 * // Background
 * $bg-color: () !default;
 * $bg-color: map.merge(
 *  (
 *    'page': #0a0a0a,
 *    '': #141414, // 与该值关联
 *    'overlay': #1d1e1f,
 *  ),
 *  $bg-color
 * );
 */
export const DARK_MODE_MIX_COLOR = '#141414'

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
  map.set(ContentEnum.FULL, t('layout.setting.contentModeFull'))
  map.set(ContentEnum.FIXED, t('layout.setting.contentModeFixed'))
  return map
})()

export const topMenuAlignMap: Map<TopMenuAlign, string> = (() => {
  const map = new Map<TopMenuAlign, string>()
  map.set('flex-start', t('layout.setting.topMenuTypeLeft'))
  map.set('center', t('layout.setting.topMenuTypeCenter'))
  map.set('flex-end', t('layout.setting.topMenuTypeRight'))
  return map
})()
