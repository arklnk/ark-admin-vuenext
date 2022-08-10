import type { App } from 'vue'

import { setupPermissionDirective } from '/@/directives/permission'

export function setupGlobalDirectives(app: App) {
  setupPermissionDirective(app)
}
