export interface ElementUISetting {
  size: 'small' | 'default' | 'large'
  zIndex: number
  autoInsertSpace: boolean
  maxMessage: number
}

export interface MenuSetting {
  hidden: boolean
  collapse: boolean
  /**
   *
   * @description 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
   * 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
   * 若你想不管路由下面的 children 声明的个数都显示你的根路由
   * 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
   * @default true
   */
  alwaysShow: boolean
}

export interface HeaderSetting {
  fullscreen: boolean
}

export interface ProjectConfig {
  grayMode: boolean
  showBreadCrumb: boolean
  menuSetting: MenuSetting
  elementUISetting: ElementUISetting
  headerSetting: HeaderSetting
}
