import type {
  ContentEnum,
  PermissionModeEnum,
  RouterTransitionEnum,
  ThemeEnum,
} from '/@/enums/appEnum'
import type { MenuModeEnum, MenuTriggerEnum } from '/@/enums/menuEnum'

export type TopMenuAlign = 'flex-start' | 'center' | 'flex-end'

export type SizeType = 'small' | 'default' | 'large'

export type LocaleType = 'en' | 'zh_CN'

export interface ElementUISetting {
  size: SizeType
  zIndex: number
  button: {
    autoInsertSpace: boolean
  }
  message: {
    max: number
  }
}

export interface MenuSetting {
  // 是否折叠菜单
  collapsed: boolean

  // 手风琴
  uniqueOpened: boolean

  // 菜单背景色
  bgColor: string

  // 背景主题
  theme: ThemeEnum

  // 菜单栏宽度
  menuWidth: number

  // 菜单模式
  menuMode: MenuModeEnum

  // 顶部菜单模式时放置位置
  topMenuAlign: TopMenuAlign

  // 折叠菜单显示位置
  trigger: MenuTriggerEnum
}

export interface HeaderSetting {
  // 是否固定顶部
  fixed: boolean

  // 顶部背景色
  bgColor: string

  // 背景主题
  theme: ThemeEnum

  // 是否显示全屏按钮
  showFullScreen: boolean
}

export interface TransitionSetting {
  // 页面切换动画是否开启
  enable: boolean

  // NProgress设置
  enableNProgress: boolean

  // 页面切换动画
  routerTransition: RouterTransitionEnum
}

export interface LocaleSetting {
  // 显示语言选择器
  showPicker: boolean

  // 当前语言环境
  locale: LocaleType

  // 默认语言
  fallback: LocaleType

  // 可用的语言环境
  availableLocales: LocaleType[]
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

  // 显示设置按钮
  showSettingButton: boolean

  // 显示夜间模式开关
  showDarkModeToggle: boolean

  // 内容区域宽度
  contentMode: ContentEnum

  // 主界面全屏显示， 菜单以及顶部不会显示
  fullContent: boolean

  // 权限模式
  permissionMode: PermissionModeEnum

  // 切换界面时是否取消已经发送但没有响应的http请求。
  // 如果启用，我想覆盖单个接口。可以在单独的界面中设置
  removeAllHttpPending: boolean

  // 切换页面时关闭上一页所有消息
  closeMessageOnSwitch: boolean

  // 开启返回顶部
  useOpenBackTop: boolean

  // keepalive 缓存页面
  openKeepAlive: boolean

  // 菜单设置
  menuSetting: MenuSetting

  // UI库设置
  elementUISetting: ElementUISetting

  // 顶部设置
  headerSetting: HeaderSetting

  // 过渡动画设置
  transitionSetting: TransitionSetting
}
