import { tryOnMounted, tryOnUnmounted } from '@vueuse/core'
import { debounce } from 'lodash-es'

interface WindowSizeOptions {
  immediate?: boolean
  listenerOptions?: AddEventListenerOptions | boolean
}

export function useWindowSizeFn(fn: Fn, wait = 150, options?: WindowSizeOptions) {
  let handler = () => {
    fn()
  }
  const realHandler = debounce(handler, wait)
  handler = realHandler

  const start = () => {
    if (options && options.immediate) {
      handler()
    }
    window.addEventListener('resize', handler)
  }

  const stop = () => {
    window.removeEventListener('resize', handler)
  }

  tryOnMounted(() => {
    start()
  })

  tryOnUnmounted(() => {
    stop()
  })

  return [start, stop]
}
