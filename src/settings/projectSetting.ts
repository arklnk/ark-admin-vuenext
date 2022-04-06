import {
  APP_PRESET_COLOR_LIST,
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
} from './designSetting'
import type { ProjectConfig } from '/#/config'

const setting: ProjectConfig = {
  grayMode: false,
  colorWeak: false,
  showBreadCrumb: true,
  showFooter: true,
  showLogo: true,
  themeColor: APP_PRESET_COLOR_LIST[3],
  menuSetting: {
    collapsed: false,
    uniqueOpened: false,
    bgColor: SIDE_BAR_BG_COLOR_LIST[2],
  },
  headerSetting: {
    fixed: true,
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
  },
  elementUISetting: {
    size: 'default',
    zIndex: 2000,
    autoInsertSpace: true,
    maxMessage: 5,
  },
  transitionSetting: {
    enableNProgress: true,
  },
}

export default setting
