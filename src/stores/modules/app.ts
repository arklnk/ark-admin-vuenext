import { defineStore } from 'pinia'
import { MenuSetting, ProjectConfig } from '/#/config'
import { DeviceEnum, KEY_PROJ_CFG } from '/@/enums/appEnum'
import { merge } from 'lodash-es'

interface AppState {
  device: DeviceEnum
  projectConfig: ProjectConfig | null | undefined
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    device: DeviceEnum.DESKTOP,
    projectConfig: JSON.parse(localStorage.getItem(KEY_PROJ_CFG) || '{}') as ProjectConfig,
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
      localStorage.setItem(KEY_PROJ_CFG, JSON.stringify(this.projectConfig))
    }
  }
})
