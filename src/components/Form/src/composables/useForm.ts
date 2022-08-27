import type { BasicFormProps, BasicFormActionType, UseFormReturnType, FormSchema } from '../typing'
import type { FormItemProp } from 'element-plus'
import type { WatchStopHandle } from 'vue'

import { onUnmounted, ref, unref, watch } from 'vue'
import { error } from '/@/utils/log'
import { isProdMode } from '/@/utils/env'
import { toRefableProps } from '/@/utils'

type Props = Partial<RefableProps<BasicFormProps>>

export function useForm(formProps?: Props): UseFormReturnType {
  const formRef = ref<Nullable<BasicFormActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)

  function getForm() {
    const form = unref(formRef)
    if (!form) {
      error(
        'form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!'
      )
    }
    return form as BasicFormActionType
  }

  let stopWatch: WatchStopHandle

  function register(instance: BasicFormActionType) {
    if (isProdMode()) {
      onUnmounted(() => {
        formRef.value = null
        loadedRef.value = null
      })
    }

    if (unref(loadedRef) && isProdMode() && instance === unref(formRef)) return

    formRef.value = instance
    loadedRef.value = true

    if (formProps) {
      instance.setProps(toRefableProps(formProps))
      stopWatch?.()

      stopWatch = watch(
        () => formProps,
        () => {
          formProps && instance.setProps(toRefableProps(formProps))
        },
        {
          deep: true,
        }
      )
    }
  }

  const methods: BasicFormActionType = {
    async validate(): Promise<void> {
      await getForm().validate()
    },

    async validateField(fields?: Arrayable<FormItemProp>): Promise<void> {
      await getForm().validateField(fields)
    },

    async resetFields(): Promise<void> {
      await getForm().resetFields()
    },

    scrollToField(prop: FormItemProp) {
      getForm().scrollToField(prop)
    },

    clearValidate(props?: Arrayable<FormItemProp>) {
      getForm().clearValidate(props)
    },

    setFormModel(values: Recordable) {
      getForm().setFormModel(values)
    },

    setProps(formProps: Partial<BasicFormProps>) {
      getForm().setProps(formProps)
    },

    getFieldsValue(): Recordable {
      return getForm().getFieldsValue()
    },

    resetSchema(schema: Arrayable<FormSchema>) {
      getForm().resetSchema(schema)
    },

    updateSchema(schema: Arrayable<Partial<FormSchema>>) {
      getForm().updateSchema(schema)
    },

    removeSchemaByProp(props: FormItemProp[]) {
      getForm().removeSchemaByProp(props)
    },

    appendSchemaByProp(schema: FormSchema, prop?: FormItemProp, first?: boolean) {
      getForm().appendSchemaByProp(schema, prop, first)
    },

    submit(): Promise<void> {
      return getForm().submit()
    },
  }

  return [register, methods]
}
