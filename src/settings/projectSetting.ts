import type { ProjectConfig } from '/#/config'

const setting: ProjectConfig = {
  grayMode: false,
  showBreadCrumb: true,
  showFooter: false,
  menuSetting: {
    collapsed: false,
    uniqueOpened: true,
  },
  elementUISetting: {
    size: 'default',
    zIndex: 2000,
    autoInsertSpace: true,
    maxMessage: 5,
  },
  headerSetting: {
    fixed: true,
  },
}

export default setting
