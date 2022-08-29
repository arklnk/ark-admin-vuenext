import type { LangModule } from '../typing'

import { genMessage } from '../helper'
import eleLocale from 'element-plus/lib/locale/lang/zh-cn'
import dayjsLocale from 'dayjs/locale/zh-cn'

const modules = import.meta.glob('./zh_CN/**/*.ts', { eager: true }) as Recordable<Recordable<any>>

export default {
  message: {
    ...genMessage(modules, 'zh_CN'),
    eleLocale,
    dayjsLocale,
  },
} as LangModule
