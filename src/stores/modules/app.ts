import { defineStore } from 'pinia'
import type { HeaderSetting, MenuSetting, ProjectConfig } from '/#/config'
import { merge } from 'lodash-es'

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
  },
  actions: {
    setProjectConfig(config: ProjectConfig): void {
      this.projectConfig = merge(this.projectConfig || {}, config)
    },
  },
})
