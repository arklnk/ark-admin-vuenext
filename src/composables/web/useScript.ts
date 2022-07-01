import { onMounted, onUnmounted, ref } from 'vue'

interface ScriptOptions {
  src: string
  id?: string
}

export function useScript(opt: ScriptOptions) {
  const isLoading = ref(false)
  const isSuccess = ref(false)

  let script: HTMLScriptElement

  const promise = new Promise((resolve, reject) => {
    onMounted(() => {
      script = document.createElement('script')
      script.type = 'text/javascript'
      script.onload = function () {
        isLoading.value = false
        isSuccess.value = true
        resolve('')
      }

      script.onerror = function (err) {
        isLoading.value = false
        isSuccess.value = false
        reject(err)
      }

      script.src = opt.src
      opt.id && (script.id = opt.id)

      isLoading.value = true
      document.head.appendChild(script)
    })
  })

  onUnmounted(() => {
    script && script.remove()
  })

  return {
    isLoading,
    isSuccess,
    toPromise: () => promise,
  }
}
