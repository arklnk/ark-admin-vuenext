import { ref, shallowRef } from 'vue'
import type { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'
import type { UseAxiosOptions } from '/#/axios'
import axios from 'axios'
import instance from '/@/utils/request'

/**
 * Wrapper for axios.
 * Source By https://github.com/vueuse/vueuse/blob/main/packages/integrations/useAxios/index.ts
 *
 * @see https://vueuse.org/useAxios
 */
export function useAxios<T = any>(
  url: string,
  config: AxiosRequestConfig = {},
  options: UseAxiosOptions = { immediate: true },
) {
  const response = shallowRef<AxiosResponse<T>>()
  const data = shallowRef<T>()
  const isFinished = ref(false)
  const isLoading = ref(false)
  const aborted = ref(false)
  const error = shallowRef<AxiosError<T>>()

  const cancelToken: CancelTokenSource = axios.CancelToken.source()
  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value) return

    cancelToken.cancel(message)
    aborted.value = true
    isLoading.value = false
    isFinished.value = false
  }
  const loading = (loading: boolean) => {
    isLoading.value = loading
    isFinished.value = !loading
  }
  const execute = (extraConfig: AxiosRequestConfig = {}) => {
    loading(true)
    instance(url, { ...config, ...extraConfig, cancelToken: cancelToken.token })
      .then((r: any) => {
        response.value = r
        data.value = r.data
      })
      .catch((e: any) => {
        error.value = e
      })
      .finally(() => {
        loading(false)
      })
  }

  // immediate
  if (options.immediate) {
    execute()
  }

  return {
    response,
    data,
    error,
    finished: isFinished,
    loading: isLoading,
    isFinished,
    isLoading,
    cancel: abort,
    canceled: aborted,
    aborted,
    abort,
    execute,
  }
}
