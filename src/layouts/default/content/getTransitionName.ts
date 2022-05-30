import type { RouteLocation } from 'vue-router'

export function getTransitionName({
  enableTransition,
  def,
  route,
}: {
  enableTransition: boolean
  def: string
  route: RouteLocation
}): string | undefined {
  if (!enableTransition) {
    return undefined
  }
  return route.meta?.transitionName || def
}
