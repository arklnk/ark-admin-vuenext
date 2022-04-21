import { computed, ref, unref } from 'vue'
import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'

const appHeaderHeightRef = ref(0)
const appFooterHeightRef = ref(0)

export function useLayoutHeight() {
  function setAppHeaderHeight(val: number) {
    appHeaderHeightRef.value = val
  }

  function setAppFooterHeight(val: number) {
    appFooterHeightRef.value = val
  }

  return { setAppHeaderHeight, setAppFooterHeight, appFooterHeightRef, appHeaderHeightRef }
}

export function useContentViewHeight(includeFooter: boolean = false) {
  const { getFullContent } = useRootSetting()
  const contentHeight = ref(window.innerHeight)

  const getViewHeight = computed(() => {
    const footerHeight = includeFooter ? unref(appFooterHeightRef) : 0
    const headerHeight = unref(getFullContent) ? 0 : unref(appHeaderHeightRef)
    return unref(contentHeight) - headerHeight - footerHeight || 0
  })

  function setContentHeight(height: number) {
    contentHeight.value = height
  }

  useWindowSizeFn(
    () => {
      contentHeight.value = window.innerHeight
    },
    100,
    { immediate: true }
  )

  return {
    contentHeight: getViewHeight,

    setContentHeight,
  }
}
