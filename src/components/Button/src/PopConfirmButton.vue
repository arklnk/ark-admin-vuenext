<script lang="ts">
import type { ConcreteComponent } from 'vue'
import type { PopconfirmProps } from './typing'

import { defineComponent, resolveComponent, h, computed, unref } from 'vue'
import { useTransl } from '/@/composables/core/useTransl'
import { extendSlots } from '/@/utils/helper/tsx'
import { buttonProps } from 'element-plus'

const props = Object.assign(buttonProps, {
  popconfirmProps: {
    type: Object as PropType<PopconfirmProps>,
  },
})

export default defineComponent({
  name: 'PopConfirmButton',
  inheritAttrs: false,
  props,
  emits: ['click'],
  setup(props, { slots, emit, attrs }) {
    const { t } = useTransl()

    const getBindValues = computed(() => {
      return {
        ...props,
        ...attrs,
      }
    })

    const getPopBindValues = computed(() => {
      return Object.assign(
        {
          confirmButtonText: t('common.basic.confirm'),
          cancelButtonText: t('common.basic.cancel'),
        },
        {
          ...(props.popconfirmProps || {}),
          onConfirm: () => {
            emit('click')
          },
        }
      )
    })

    return () => {
      const ElPopconfirm = resolveComponent('ElPopconfirm') as ConcreteComponent
      const ElButton = resolveComponent('ElButton') as ConcreteComponent

      const Button = h(ElButton, unref(getBindValues), extendSlots(slots))

      return h(ElPopconfirm, unref(getPopBindValues), { reference: () => Button })
    }
  },
})
</script>
