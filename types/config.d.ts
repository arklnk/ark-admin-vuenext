import { ContentEnum, RouterTransitionEnum } from '/@/enums/appEnum'
import { MenuModeEnum } from '/@/enums/menuEnum'

export interface ElementUISetting {
  size: 'small' | 'default' | 'large'
  zIndex: number
  autoInsertSpace: boolean
  maxMessage: number
}

export interface MenuSetting {
  // 是否折叠菜单
  collapsed: boolean

  // 手风琴
  uniqueOpened: boolean

  // 菜单背景色
  bgColor: string

  /**
   * 菜单模式
   */
  menuMode: MenuModeEnum

  /**
   * 顶部菜单模式时放置位置
   */
  topMenuAlign: 'start' | 'center' | 'end'
}

export interface HeaderSetting {
  // 是否固定顶部
  fixed: boolean

  // 顶部背景色
  bgColor: string
}

export interface TransitionSetting {
  // NProgress设置
  enableNProgress: boolean

  // 页面切换动画
  routerTransition: RouterTransitionEnum
}

export interface ProjectConfig {
  // 网页灰色模式（哀悼日等）
  grayMode: boolean

  // 网页色弱模式
  colorWeak: boolean

  // 网站主题色
  themeColor: string

  // 是否显示面包屑
  showBreadCrumb: boolean

  // 是否显示页脚
  showFooter: boolean

  // 是否显示网页Logo
  showLogo: boolean

  // 内容区域宽度
  contentMode: ContentEnum

  // 切换界面时是否取消已经发送但没有响应的http请求。
  // 如果启用，我想覆盖单个接口。可以在单独的界面中设置
  removeAllHttpPending: boolean

  // 菜单设置
  menuSetting: MenuSetting

  // UI库设置
  elementUISetting: ElementUISetting

  // 顶部设置
  headerSetting: HeaderSetting

  // 过渡动画设置
  transitionSetting: TransitionSetting
}
