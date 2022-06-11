import type { Router, RouteLocationRaw } from 'vue-router'

import { useRouter } from 'vue-router'
import { PageEnum } from '/@/enums/pageEnum'

function handleError(e: Error) {
  console.error(e)
}

export function useGo(_router?: Router) {
  let router: Router | undefined
  if (!_router) {
    router = useRouter()
  }
  const { replace, push } = _router || router!

  function go(opt: PageEnum | string | RouteLocationRaw = PageEnum.Root, isReplace = false) {
    if (!opt) return

    isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError)
  }

  return go
}
