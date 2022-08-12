import type { App } from 'vue'

import { setupPermissionDirective } from '/@/directives/permission'

/**
 * Configure and register global directives
 */
export function setupGlobalDirectives(app: App) {
  setupPermissionDirective(app)
}
