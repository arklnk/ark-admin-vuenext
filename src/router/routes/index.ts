import type { RouteRecordRaw } from 'vue-router'
import type { Component } from '/#/vue-router'

import { warn } from '/@/utils/log'

export const backModuleMap: Record<string, Component> = {}
export const roleRoutes: RouteRecordRaw[] = []

const roleModules = import.meta.globEager('./modules/**/*.ts')

// role module
Object.keys(roleModules).forEach((key) => {
  const mod = roleModules[key].default
  if (!mod) {
    warn(`导出的${key}模块为空`)
    return
  }
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  roleRoutes.push(...modList)
})
