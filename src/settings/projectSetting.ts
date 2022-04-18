import type { ProjectConfig } from '/#/config'

import { RouterTransitionEnum } from '/@/enums/appEnum'
import { MenuModeEnum } from '/@/enums/menuEnum'
import {
  APP_PRESET_COLOR_LIST,
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
} from './designSetting'

const setting: ProjectConfig = {
  grayMode: false,
  colorWeak: false,
  showBreadCrumb: true,
  showFooter: false,
  showLogo: true,
  themeColor: APP_PRESET_COLOR_LIST[3],
  removeAllHttpPending: false,
  menuSetting: {
    collapsed: false,
    uniqueOpened: false,
    bgColor: SIDE_BAR_BG_COLOR_LIST[2],
    menuMode: MenuModeEnum.SIDEBAR,
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
    routerTransition: RouterTransitionEnum.FADE,
  },
}

export default setting
