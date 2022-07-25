import { ComputedRef, Ref } from 'vue'
import type { BasicFormProps, FormSchema } from '../typing'

import { unref } from 'vue'
import { cloneDeep, get, isFunction, isNil, isPlainObject, isString, set } from 'lodash-es'
import { formatToDateTime, isDateObject } from '/@/utils/date'

interface UseFormValuesParams {
  defaultValueRef: Ref<any>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  getProps: ComputedRef<BasicFormProps>
}

export function useFormValues({
  getSchema,
  formModel,
  defaultValueRef,
  getProps,
}: UseFormValuesParams) {
  function processFormValues(values: Recordable) {
    if (!isPlainObject(values)) {
      return {}
    }
    const res: Recordable = {}
    for (const item of Object.entries(values)) {
      let [, v] = item
      const [k] = item
      if (!k || isFunction(v)) {
        continue
      }

      const dateFormat = unref(getProps).dateFormat
      // transform
      if (isString(v)) {
        // string remove spaces
        v = v.trim()
      } else if (isDateObject(v)) {
        // date object
        v = formatToDateTime(v, dateFormat)
      } else if (Array.isArray(v) && v.length === 2 && isDateObject(v[0]) && isDateObject(v[1])) {
        // date range array
        v = v.map((e) => formatToDateTime(e, dateFormat))
      } else if (isPlainObject(v)) {
        // deep transform
        v = processFormValues(v)
      }

      // 其他值则不再处理
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

        // update form model
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
