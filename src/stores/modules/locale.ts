import type { LocaleSetting, LocaleType } from '/#/config'

import { defineStore } from 'pinia'
import { KEY_LOCALE } from '/@/enums/cacheEnum'
import { localeSetting } from '/@/settings/localeSetting'
import WebStorage from '/@/utils/cache'

interface LocaleState {
  localeInfo: LocaleSetting
}

export const useLocaleStore = defineStore({
  id: 'app-locale',
  state: (): LocaleState => ({
    localeInfo: WebStorage.get<LocaleSetting>(KEY_LOCALE, {})!,
  }),
  getters: {
    getShowPicker(): boolean {
      return !!this.localeInfo?.showPicker
    },
    getLocale(): LocaleType {
      return this.localeInfo.locale ?? 'zh_CN'
    },
  },
  actions: {
    setLocaleInfo(info: Partial<LocaleSetting>) {
      this.localeInfo = { ...this.localeInfo, ...info }
      WebStorage.set(KEY_LOCALE, this.localeInfo)
    },
    /**
     * init and load existing config
     */
    initLocale() {
      this.setLocaleInfo({
        ...localeSetting,
        ...this.localeInfo,
      })
    },
  },
})
