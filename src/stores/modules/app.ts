import { defineStore, _DeepPartial } from 'pinia'
import type { HeaderSetting, MenuSetting, TransitionSetting, ProjectConfig } from '/#/config'
import { merge } from 'lodash-es'
import { KEY_SETTING } from '/@/enums/cacheEnum'

interface AppState {
  projectConfig: ProjectConfig | null
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    projectConfig: null,
  }),
  getters: {
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
    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = merge(this.projectConfig || {}, config) as ProjectConfig
      // store
      localStorage.setItem(KEY_SETTING, JSON.stringify(this.getProjectConfig))
    },
  },
})
