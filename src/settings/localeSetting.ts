import type { LocaleSetting, LocaleType } from '/#/config'

export const LOCALE: { [key: string]: LocaleType } = {
  EN: 'en',
  ZH_CN: 'zh_CN',
}

export const localeSetting: LocaleSetting = {
  showPicker: false,
  locale: LOCALE.ZH_CN,
  fallback: LOCALE.ZH_CN,
  availableLocales: [LOCALE.EN, LOCALE.ZH_CN],
}

export const localeList: LabelValueOptions = [
  {
    label: '简体中文',
    value: LOCALE.ZH_CN,
  },
  {
    label: 'English',
    value: LOCALE.EN,
  },
]
