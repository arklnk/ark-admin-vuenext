import { ref } from 'vue'

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
