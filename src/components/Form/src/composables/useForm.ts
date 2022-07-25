import type { BasicFormProps, BasicFormActionType } from '../typing'
import type { FormItemProp } from 'element-plus'

import { onUnmounted, ref, unref, nextTick } from 'vue'
import { error } from '/@/utils/log'

export function useForm(_props?: Partial<RefableProps<BasicFormProps>>) {
  const formRef = ref<Nullable<BasicFormActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)

  async function getForm() {
    const form = unref(formRef)
    if (!form) {
      error(
        'form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!'
      )
    } else {
      await nextTick()
    }
    return form as BasicFormActionType
  }

  function register(instance: BasicFormActionType) {
    onUnmounted(() => {
      formRef.value = null
      loadedRef.value = null
    })
    if (unref(loadedRef) && instance === unref(formRef)) return

    formRef.value = instance
    loadedRef.value = true
  }

  const methods = {
    async validate(): Promise<boolean> {
      const form = await getForm()
      return await form.validate()
    },
    async validateField(fields?: Arrayable<FormItemProp>): Promise<boolean> {
      const form = await getForm()
      return await form.validateField(fields)
    },
    async resetFields() {
      const form = await getForm()
      await form.resetFields()
    },
  }

  return [register, methods]
}
