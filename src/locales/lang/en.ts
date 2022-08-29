import type { LangModule } from '../typing'

import { genMessage } from '../helper'
import eleLocale from 'element-plus/lib/locale/lang/en'
import dayjsLocale from 'dayjs/locale/en'

const modules = import.meta.glob('./en/**/*.ts', { eager: true }) as Recordable<Recordable<any>>

export default {
  message: {
    ...genMessage(modules, 'en'),
    eleLocale,
    dayjsLocale,
  },
} as LangModule
