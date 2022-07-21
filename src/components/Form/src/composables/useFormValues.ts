import { ComputedRef, Ref } from 'vue'
import type { BasicFormProps, FormSchema } from '../typing'

import { unref } from 'vue'
import { cloneDeep, get, isFunction, isNil, isObject, isString, set } from 'lodash-es'

interface UseFormValuesParams {
  defaultValueRef: Ref<any>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  getProps: ComputedRef<BasicFormProps>
}

export function useFormValues({ getSchema, formModel, defaultValueRef }: UseFormValuesParams) {
  function processFormValues(values: Recordable) {
    if (!isObject(values)) {
      return {}
    }
    const res: Recordable = {}
    for (const item of Object.entries(values)) {
      let [, v] = item
      const [k] = item
      if (!k || isFunction(v)) {
        continue
      }

      if (isString(v)) {
        v = v.trim()
      }

      set(res, k, v)
    }
    return res
  }

  function initDefault() {
    const schemas = unref(getSchema)
    const def: Recordable = {}

    schemas.forEach((item: FormSchema) => {
      const { defaultValue } = item

      if (!isNil(defaultValue)) {
        set(def, item.prop, defaultValue)

        if (get(formModel, item.prop) === undefined) {
          set(formModel, item.prop, defaultValue)
        }
      }
    })

    defaultValueRef.value = cloneDeep(def)
  }

  return {
    processFormValues,
    initDefault,
  }
}
