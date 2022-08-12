import type { LangModule } from '../typing'

import { genMessage } from '../helper'
import eleLocale from 'element-plus/lib/locale/lang/en'
import dayjsLocale from 'dayjs/locale/en'

const modules = import.meta.globEager('./en/**/*.ts')

export default {
  message: {
    ...genMessage(modules, 'en'),
    eleLocale,
    dayjsLocale,
  },
} as LangModule
