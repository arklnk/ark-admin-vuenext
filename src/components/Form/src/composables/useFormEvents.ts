import type { ComputedRef, Ref } from 'vue'
import type { BasicFormProps, FormSchema } from '../typing'
import type { FormInstance, FormItemProp } from 'element-plus'

import { unref, toRaw } from 'vue'
import {
  assign,
  cloneDeep,
  get,
  hasIn,
  isEqual,
  isFunction,
  isNil,
  isPlainObject,
  mergeWith,
  set,
  uniqWith,
  unset,
} from 'lodash-es'
import { error } from '/@/utils/log'

interface UseFormEventsParams {
  emit: EmitFn
  getProps: ComputedRef<BasicFormProps>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  defaultValueRef: Ref<Recordable>
  formElRef: Ref<Nullable<FormInstance>>
  schemaRef: Ref<Nullable<FormSchema[]>>
  processFormValues: Fn
}

export function useFormEvents({
  emit,
  getProps,
  formElRef,
  getSchema,
  formModel,
  schemaRef,
  defaultValueRef,
  processFormValues,
}: UseFormEventsParams) {
  function setFormModel(values: Recordable) {
    if (!isPlainObject(values)) return

    const props = unref(getSchema)
      .map((e) => e.prop)
      .filter((e) => hasIn(values, e))

    props.forEach((item: FormItemProp) => {
      // check
      const fieldValue = cloneDeep(get(values, item))
      set(formModel, item, fieldValue)
    })

    // try validate update prop
    if (props.length > 0) {
      validateField(props).catch((_) => {})
    }
  }

  async function resetFields(): Promise<void> {
    const { resetFunc } = unref(getProps)
    resetFunc && isFunction(resetFunc) && (await resetFunc())

    const formEl = unref(formElRef)

    if (!formEl) return
    // formEl?.resetFields(props)

    const resetProps: FormItemProp[] = unref(getSchema).map((e) => e.prop)

    resetProps.forEach((item: FormItemProp) => {
      const defaultValue = cloneDeep(get(defaultValueRef.value, item))
      set(formModel, item, defaultValue)
    })
    clearValidate()

    emit('reset', toRaw(formModel))
  }

  function resetSchema(schema: Arrayable<FormSchema>) {
    let updated: FormSchema[] = []

    if (Array.isArray(schema)) {
      updated = [...schema]
    } else {
      updated.push(schema as FormSchema)
    }

    const allValidProp = updated.every((item) => Reflect.has(item, 'prop') && item.prop)

    if (!allValidProp) {
      error(
        'all children of the form Schema array that need to be updated must contain the `prop` field'
      )
      return
    }

    schemaRef.value = updated as FormSchema[]
  }

  function updateSchema(schema: Arrayable<Partial<FormSchema>>) {
    let updated: Partial<FormSchema>[] = []

    if (Array.isArray(schema)) {
      updated = [...schema]
    } else {
      updated.push(schema)
    }

    const allValidProp = updated.every((item) => Reflect.has(item, 'prop') && item.prop)

    if (!allValidProp) {
      error(
        'all children of the form Schema array that need to be updated must contain the `prop` field'
      )
      return
    }

    // 只会更新存在的，不存在的不会新增
    let newSchema: FormSchema[] = []

    updated.forEach((item) => {
      unref(getSchema).forEach((entry) => {
        // find same prop replace
        if (isEqual(item.prop, entry.prop)) {
          // https://www.lodashjs.com/docs/lodash.mergeWith
          // componentProps 不做复杂数据合并处理
          const newItem = mergeWith(entry, item, (objValue, srcValue, key: keyof FormSchema) => {
            if (key === 'componentProps') {
              return assign({}, objValue, srcValue)
            }
          })
          newSchema.push(newItem)
        } else {
          newSchema.push(entry)
        }
      })
    })

    // filter uniq
    newSchema = uniqWith(newSchema, (v1, v2) => isEqual(v1.prop, v2.prop))

    _setDefaultValue(newSchema)
    schemaRef.value = newSchema
  }

  function removeSchemaByProp(props: FormItemProp[]) {
    if (!props || props.length === 0) {
      return
    }

    const schemas = cloneDeep(unref(getSchema))
    props.forEach((item) => {
      const findIndex = schemas.findIndex((e) => isEqual(e.prop, item))
      if (findIndex !== -1) {
        unset(formModel, item)
        schemas.splice(findIndex, 1)
      }
    })

    schemaRef.value = schemas
  }

  function appendSchemaByProp(schema: FormSchema, prop?: FormItemProp, first = false) {
    if (!schema) return

    const schemasClone = cloneDeep(unref(getSchema))

    // inset
    if (first) {
      schemasClone.unshift(schema)
    } else {
      const index = schemasClone.findIndex((e) => isEqual(e.prop, prop))
      index === -1 ? schemasClone.push(schema) : schemasClone.splice(index + 1, 0, schema)
    }
    _setDefaultValue([schema])

    schemaRef.value = schemasClone
  }

  function _setDefaultValue(schemas: FormSchema[]) {
    const obj: Recordable = {}
    const curFieldsValue = getFieldsValue()
    schemas.forEach((item) => {
      if (item.prop && !isNil(item.defaultValue) && !hasIn(curFieldsValue, item.prop)) {
        set(obj, item.prop, item.defaultValue)
      }
    })

    setFormModel(obj)
  }

  function clearValidate(props?: Arrayable<FormItemProp>) {
    unref(formElRef)?.clearValidate(props)
  }

  async function validate(): Promise<void> {
    return new Promise((resolve, reject) => {
      const formEl = unref(formElRef)
      if (!formEl) {
        reject(new Error('form instance has not been obtained'))
        return
      }
      formEl.validate((isValid: boolean, invalidFields?: Recordable) => {
        if (isValid) {
          resolve()
        } else {
          reject(invalidFields)
        }
      })
    })
  }

  async function validateField(props?: Arrayable<FormItemProp>): Promise<void> {
    return new Promise((resolve, reject) => {
      const formEl = unref(formElRef)
      if (!formEl) {
        reject(new Error('form instance has not been obtained'))
        return
      }
      formEl.validateField(props, (isValid: boolean, invalidFields?: Recordable) => {
        if (isValid) {
          resolve()
        } else {
          reject(invalidFields)
        }
      })
    })
  }

  function scrollToField(prop: FormItemProp) {
    unref(formElRef)?.scrollToField(prop)
  }

  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef)
    if (!formEl) return {}
    return processFormValues(toRaw(unref(formModel)))
  }

  async function handleSubmit(e?: Event): Promise<void> {
    e?.preventDefault()
    const formEl = unref(formElRef)
    if (!formEl) return

    try {
      await validate()

      const res = processFormValues(toRaw(unref(formModel)))

      const { submitFunc } = unref(getProps)
      if (submitFunc && isFunction(submitFunc)) {
        await submitFunc(res)
      }
      emit('submit', res)
    } catch (e) {
      emit('submit-failed', e)
    }
  }

  return {
    setFormModel,
    resetFields,
    clearValidate,
    getFieldsValue,
    validate,
    validateField,
    scrollToField,
    handleSubmit,
    resetSchema,
    updateSchema,
    removeSchemaByProp,
    appendSchemaByProp,
  }
}
