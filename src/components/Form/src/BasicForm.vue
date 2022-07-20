<template>
  <ElForm :model="formModel">
    <ElRow>Form</ElRow>
  </ElForm>
</template>

<script lang="ts">
import type { BasicFormProps } from './typing'

import { computed, defineComponent, reactive, ref, unref } from 'vue'
import { basicProps } from './props'

export default defineComponent({
  name: 'BasicForm',
  props: basicProps,
  setup(props) {
    const innerPropsRef = ref<Partial<BasicFormProps>>()
    const formModel = reactive<Recordable>({})

    const getProps = computed((): BasicFormProps => {
      return { ...props, ...unref(innerPropsRef) } as BasicFormProps
    })

    return {
      formModel,

      getProps,
    }
  },
})
</script>
