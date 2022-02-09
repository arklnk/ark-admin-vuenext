import { defineStore } from 'pinia'
import type { MenuSetting, ProjectConfig } from '/#/config'
import { DeviceEnum } from '/@/enums/appEnum'
import { merge } from 'lodash-es'

interface AppState {
  device: DeviceEnum
  projectConfig: ProjectConfig | null
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    device: DeviceEnum.DESKTOP,
    projectConfig: null,
  }),
  getters: {
    getProjectConfig(): ProjectConfig {
      return this.projectConfig || ({} as ProjectConfig)
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting
    }
  },
  actions: {
    setProjectConfig(config: ProjectConfig): void {
      this.projectConfig = merge(this.projectConfig || {}, config)
    }
  }
})
