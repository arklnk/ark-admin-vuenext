import type { ComputedRef, Ref } from 'vue'
import type { BasicFormProps, FormSchema } from '../typing'
import type { FormInstance, FormItemProp } from 'element-plus'

import { unref, toRaw, nextTick } from 'vue'
import { cloneDeep, get, hasIn, isFunction, set } from 'lodash-es'

interface UseFormEventsParams {
  emit: EmitFn
  getProps: ComputedRef<BasicFormProps>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  defaultValueRef: Ref<Recordable>
  formElRef: Ref<FormInstance>
  schemaRef: Ref<FormSchema[]>
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
    const props = unref(getSchema).map((e) => e.prop)
    const validProps: FormItemProp[] = []

    props.forEach((field: FormItemProp) => {
      // check
      const fieldValue = get(values, field)

      if (hasIn(values, field)) {
        set(formModel, field, fieldValue)
        validProps.push(field)
      }
    })

    validateField(validProps)
  }

  async function resetFields(props?: Arrayable<FormItemProp>): Promise<void> {
    const { resetFunc } = unref(getProps)
    resetFunc && isFunction(resetFunc) && (await resetFunc())

    const formEl = unref(formElRef)

    if (!formEl) return
    // formEl?.resetFields(props)

    const resetProps: FormItemProp[] =
      props === undefined
        ? unref(getSchema).map((e) => e.prop)
        : Array.isArray(props)
        ? props
        : [props]

    resetProps.forEach((item: FormItemProp) => {
      const defaultValue = cloneDeep(get(defaultValueRef.value, item))
      set(formModel, item, defaultValue)
    })
    nextTick(() => clearValidate())

    emit('reset', toRaw(formModel))
  }

  function resetSchema(schema: Arrayable<FormSchema>) {
    let updatedSchema: FormSchema[] = []

    if (Array.isArray(schema)) {
      updatedSchema = [...schema]
    } else {
      updatedSchema.push(schema as FormSchema)
    }

    schemaRef.value = updatedSchema as FormSchema[]
  }

  function clearValidate(props?: Arrayable<FormItemProp>) {
    unref(formElRef)?.clearValidate(props)
  }

  async function validate() {
    return unref(formElRef)?.validate()
  }

  async function validateField(props?: Arrayable<FormItemProp>) {
    return unref(formElRef)?.validateField(props)
  }

  function scrollToField(prop: FormItemProp) {
    unref(formElRef)?.scrollToField(prop)
  }

  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef)
    if (!formEl) return {}
    return processFormValues(formModel)
  }

  async function handleSubmit(e?: Event): Promise<void> {
    e?.preventDefault()
    const formEl = unref(formElRef)
    if (!formEl) return

    try {
      await validate()

      const { submitFunc } = unref(getProps)
      if (submitFunc && isFunction(submitFunc)) {
        await submitFunc()
        return
      }

      const res = processFormValues(formModel)
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
  }
}
