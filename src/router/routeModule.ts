import type { Component } from '/#/vue-router'

import { warn } from '/@/utils/log'

export const routeModuleMap: Record<string, Component> = {}
export const viewPathList: string[] = []

const modules = import.meta.globEager('./modules/**/*.ts')

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default

  if (mod) {
    Object.keys(mod).forEach((viewpath) => {
      if (!routeModuleMap[viewpath]) {
        viewPathList.push(viewpath)
      }
      routeModuleMap[viewpath] = mod[viewpath]
    })
  } else {
    warn(`模块${key}必须以export default导出`)
  }
})
