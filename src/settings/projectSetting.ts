import { APP_PRESET_COLOR_LIST } from './designSetting'
import type { ProjectConfig } from '/#/config'

const setting: ProjectConfig = {
  grayMode: false,
  showBreadCrumb: true,
  showFooter: false,
  themeColor: APP_PRESET_COLOR_LIST[0],
  menuSetting: {
    collapsed: false,
    uniqueOpened: false,
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
