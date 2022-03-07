import { ref, Ref, unref, watch } from 'vue'
import { throttle, debounce } from 'lodash-es'

type RemoveEventFn = () => void
interface EventListenerParams {
  el?: Element | Ref<Element | undefined> | Window | any
  name: string
  listener: EventListener
  options?: boolean | AddEventListenerOptions
  autoRemove?: boolean
  isDebounce?: boolean
  wait?: number
}

export function useEventListener({
  el = window,
  name,
  listener,
  options,
  autoRemove = true,
  isDebounce = true,
  wait = 100,
}: EventListenerParams): RemoveEventFn {
  let remove: RemoveEventFn = () => {}
  const isAddRef = ref(false)

  if (el) {
    const element = ref(el as Element) as Ref<Element>

    const handler = isDebounce ? debounce(listener, wait) : throttle(listener, wait)
    const realHandler = wait ? handler : listener

    const removeEventListener = (ele: Element) => {
      isAddRef.value = true
      ele.removeEventListener(name, realHandler, options)
    }
    const addEventListener = (ele: Element) => ele.addEventListener(name, realHandler, options)

    const removeWatch = watch(
      element,
      (v, _ov, cleanUp) => {
        if (v) {
          !unref(isAddRef) && addEventListener(v)
          cleanUp(() => {
            autoRemove && removeEventListener(v)
          })
        }
      },
      { immediate: true }
    )

    // update
    remove = () => {
      removeEventListener(element.value)
      removeWatch()
    }
  }

  return remove
}
