import type { ProjectConfig } from '/#/config'

import { ContentEnum, PermissionModeEnum, RouterTransitionEnum, ThemeEnum } from '/@/enums/appEnum'
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
  showSettingButton: true,
  fullContent: false,
  useOpenBackTop: true,
  themeColor: APP_PRESET_COLOR_LIST[3],
  theme: ThemeEnum.LIGHT,
  contentMode: ContentEnum.FULL,
  permissionMode: PermissionModeEnum.BACK,
  removeAllHttpPending: false,
  closeMessageOnSwitch: false,
  menuSetting: {
    collapsed: false,
    uniqueOpened: false,
    menuWidth: 256,
    bgColor: SIDE_BAR_BG_COLOR_LIST[2],
    theme: ThemeEnum.DARK,
    menuMode: MenuModeEnum.SIDEBAR,
    topMenuAlign: 'flex-start',
  },
  headerSetting: {
    fixed: true,
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    theme: ThemeEnum.LIGHT,
    showFullScreen: true,
  },
  elementUISetting: {
    size: 'default',
    zIndex: 2000,
    button: {
      autoInsertSpace: true,
    },
    message: {
      max: 5,
    },
  },
  transitionSetting: {
    enable: true,
    enableNProgress: true,
    routerTransition: RouterTransitionEnum.FADE,
  },
}

export default setting
