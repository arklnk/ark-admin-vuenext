export interface ElementUISetting {
  size: 'small' | 'default' | 'large'
  zIndex: number
  autoInsertSpace: boolean
  maxMessage: number
}

export interface MenuSetting {
  collapsed: boolean
  uniqueOpened: boolean
}

export interface HeaderSetting {
  fixed: boolean
}

export interface ProjectConfig {
  grayMode: boolean
  showBreadCrumb: boolean
  showFooter: boolean
  menuSetting: MenuSetting
  elementUISetting: ElementUISetting
  headerSetting: HeaderSetting
}
