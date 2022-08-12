import type { LocaleSetting, LocaleType } from '/#/config'

import { defineStore } from 'pinia'
import { KEY_LOCALE } from '/@/enums/cacheEnum'
import { localeSetting } from '/@/settings/localeSetting'

interface LocaleState {
  localeInfo: LocaleSetting
}

export const useLocaleStore = defineStore({
  id: 'app-locale',
  state: (): LocaleState => ({
    localeInfo: JSON.parse(localStorage.getItem(KEY_LOCALE) || '{}'),
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
      localStorage.setItem(KEY_LOCALE, JSON.stringify(this.localeInfo))
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
