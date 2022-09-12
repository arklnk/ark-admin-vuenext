import type { App, Directive, DirectiveBinding } from 'vue'
import { usePermission } from '/@/composables/core/usePermission'

/**
 * @description Support .and directive modifiers
 * @usage
 *    <element v-permission="sys/user/add" />
 *    <element v-permission.and="['sys/user/add']" />
 */
const directive: Directive = {
  mounted: (el: Element, binding: DirectiveBinding<any>) => {
    const { hasPermission } = usePermission()

    const { value, modifiers } = binding

    // and or to compare
    let nor: 'or' | 'and' = 'or'
    if (modifiers.and) {
      nor = 'and'
    }

    if (!hasPermission(value, nor)) {
      el.parentNode?.removeChild(el)
    }
  },
}

export function setupPermissionDirective(app: App) {
  app.directive('permission', directive)
}

export default directive
