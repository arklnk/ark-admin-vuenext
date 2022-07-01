import type { Router } from 'vue-router'
import { createHttpGuard } from './httpGuard'
import { createMessageGuard } from './messageGuard'
import { createPermissionGuard } from './permissionGuard'
import { createProgressGuard } from './progressGuard'
import { createStateGuard } from './stateGuard'

export function setupRouterGuard(router: Router) {
  createHttpGuard(router)
  createMessageGuard(router)
  createProgressGuard(router)
  createPermissionGuard(router)
  createStateGuard(router)
}
