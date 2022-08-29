import type { RouteRecordRaw } from 'vue-router'
import type { Component } from '../typing'

import { warn } from '/@/utils/log'

export const backModuleMap: Record<string, Component> = {}
export const roleRoutes: RouteRecordRaw[] = []

const roleModules: Recordable = import.meta.glob('./modules/**/*.ts', { eager: true })

/**
 * 角色权限路由时使用
 */
Object.keys(roleModules).forEach((key) => {
  const mod = roleModules[key].default
  if (!mod) {
    warn(`导出的${key}模块为空`)
    return
  }
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  roleRoutes.push(...modList)
})
