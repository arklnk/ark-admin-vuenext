export interface ElementUISetting {
  size: 'small' | 'default' | 'large'
  zIndex: number
  autoInsertSpace: boolean
  maxMessage: number
}

export interface MenuSetting {
  hidden: boolean
  collapse: boolean
  uniqueOpened: boolean
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
