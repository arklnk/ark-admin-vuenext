import type { ComputedRef } from 'vue'
import type { BasicFormProps, FormSchema } from '../typing'

import { isObject } from 'lodash-es'

interface UseFormValuesParams {
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  getProps: ComputedRef<BasicFormProps>
}

export function useFormValues(_params: UseFormValuesParams) {
  function processFormValues(values: Recordable) {
    if (!isObject(values)) {
      return {}
    }
    const res: Recordable = {}

    return res
  }

  return {
    processFormValues,
  }
}
