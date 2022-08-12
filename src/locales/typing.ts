interface LocaleMessage extends Recordable {
  // element-ui locale config
  eleLocale: any

  // dayjs locale config
  dayjsLocale: any
}

export interface LangModule {
  message: LocaleMessage
}
