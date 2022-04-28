import type { RouteRecordRaw } from 'vue-router'
import type { Component } from '/#/vue-router'

import { warn } from '/@/utils/log'

export const backModuleMap: Record<string, Component> = {}
export const roleRoutes: RouteRecordRaw[] = []

const backModules = import.meta.globEager('./modules/**/*.back.ts')
const roleModules = import.meta.globEager('./modules/**/*.role.ts')

// back module
Object.keys(backModules).forEach((key) => {
  const mod = backModules[key].default

  if (mod) {
    Object.keys(mod).forEach((viewpath) => {
      backModuleMap[viewpath] = mod[viewpath]
    })
  } else {
    warn(`模块${key}必须以export default导出`)
  }
})

// role module
Object.keys(roleModules).forEach((key) => {
  const mod = roleModules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  roleRoutes.push(...modList)
})
