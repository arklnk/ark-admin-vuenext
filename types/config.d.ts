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

export interface ProjectConfig {
  grayMode: boolean
  colorWeak: boolean
  showBreadCrumb: boolean
  showFooter: boolean
  themeColor: string
  menuSetting: MenuSetting
  elementUISetting: ElementUISetting
  headerSetting: HeaderSetting
}
