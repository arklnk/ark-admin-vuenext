import { computed, ref, unref } from 'vue'

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

export function useAppMainHeight() {
  const windowHeight = ref(window.innerHeight)

  const getMainHeight = computed(() => {
    return unref(windowHeight) - unref(appHeaderHeightRef) - unref(appFooterHeightRef)
  })

  return {
    appMainHeight: getMainHeight,
  }
}
