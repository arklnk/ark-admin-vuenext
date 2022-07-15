import { ref, unref } from 'vue'

export function useDialogFullscreen() {
  const fullscreenRef = ref(false)

  function handleFullscreen(e: Event) {
    e?.stopPropagation()

    fullscreenRef.value = !unref(fullscreenRef)
  }

  return {
    fullscreenRef,
    handleFullscreen,
  }
}
