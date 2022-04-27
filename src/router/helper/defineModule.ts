import type { RouteRecordRaw } from 'vue-router'
import type { Component } from '/#/vue-router'

/**
 * ts
 */
export function defineBackModule(module: Record<string, Component>) {
  return module
}

export function defineRoleModule(module: RouteRecordRaw) {
  return module
}
