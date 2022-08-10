import type { App, Directive, DirectiveBinding } from 'vue'
import { usePermission } from '/@/composables/core/usePermission'

const directive: Directive = {
  mounted: (el: Element, binding: DirectiveBinding<any>) => {
    const { hasPermission } = usePermission()

    const value = binding.value
    if (!value) return

    if (!hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  },
}

export function setupPermissionDirective(app: App) {
  app.directive('permission', directive)
}

export default directive
