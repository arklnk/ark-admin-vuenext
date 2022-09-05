import { defineStore, _DeepPartial } from 'pinia'
import type { HeaderSetting, MenuSetting, TransitionSetting, ProjectConfig } from '/#/config'
import { merge } from 'lodash-es'
import { KEY_SETTING, KEY_APP_DARK_MODE } from '/@/enums/cacheEnum'
import { ThemeEnum } from '/@/enums/appEnum'
import { themeMode } from '/@/settings/designSetting'
import WebStorage from '/@/utils/cache'

interface AppState {
  projectConfig: Nullable<ProjectConfig>
  darkMode: Nullable<ThemeEnum>
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    projectConfig: null,
    darkMode: null,
  }),
  getters: {
    getDarkMode(): ThemeEnum | string {
      // index.html中需要获取该值，只允许使用localStorage获取
      return this.darkMode || localStorage.getItem(KEY_APP_DARK_MODE) || themeMode
    },
    getProjectConfig(): ProjectConfig {
      return this.projectConfig || ({} as ProjectConfig)
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting
    },
    getHeaderSetting(): HeaderSetting {
      return this.getProjectConfig.headerSetting
    },
    getTransitionSetting(): TransitionSetting {
      return this.getProjectConfig.transitionSetting
    },
  },
  actions: {
    setDarkMode(mode: ThemeEnum) {
      this.darkMode = mode
      // index.html中需要获取该值，只允许使用localStorage设置
      localStorage.setItem(KEY_APP_DARK_MODE, mode)
    },
    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = merge(this.projectConfig || {}, config) as ProjectConfig
      // store
      WebStorage.set(KEY_SETTING, this.getProjectConfig)
    },
  },
})
