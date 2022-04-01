export interface ElementUISetting {
  size: 'small' | 'default' | 'large'
  zIndex: number
  autoInsertSpace: boolean
  maxMessage: number
}

export interface MenuSetting {
  collapsed: boolean
  uniqueOpened: boolean
  bgColor: string
}

export interface HeaderSetting {
  fixed: boolean
  bgColor: string
}

export interface TransitionSetting {
  enableNProgress: boolean
}

export interface ProjectConfig {
  grayMode: boolean
  colorWeak: boolean
  themeColor: string
  showBreadCrumb: boolean
  showFooter: boolean
  showLogo: boolean
  menuSetting: MenuSetting
  elementUISetting: ElementUISetting
  headerSetting: HeaderSetting
  transitionSetting: TransitionSetting
}
