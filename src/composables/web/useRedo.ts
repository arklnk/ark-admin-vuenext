import type { Router } from 'vue-router'

import { unref } from 'vue'
import { useRouter } from 'vue-router'
import { RedirectRouteName } from '/@/enums/pageEnum'

export function useRedo(_router?: Router) {
  const { replace, currentRoute } = _router || useRouter()
  const { query, fullPath, params = {}, name } = unref(currentRoute)

  function redo(): Promise<boolean> {
    return new Promise((resolve) => {
      if (name === RedirectRouteName) {
        resolve(false)
        return
      }

      if (name && Object.keys(params).length > 0) {
        params['__redirect_type__'] = 'name'
        params['path'] = String(name)
      } else {
        params['__redirect_type__'] = 'path'
        params['path'] = fullPath
      }

      replace({ name: RedirectRouteName, params, query }).then(() => resolve(true))
    })
  }

  return redo
}
