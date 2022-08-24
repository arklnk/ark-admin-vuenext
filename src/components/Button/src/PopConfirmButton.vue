<script lang="ts">
import type { ConcreteComponent } from 'vue'
import type { ButtonProps } from './typing'

import { omit } from 'lodash-es'
import { defineComponent, resolveComponent, h, computed, unref } from 'vue'
import { useTransl } from '/@/composables/core/useTransl'
import { extendSlots } from '/@/utils/helper/tsx'

const props = {
  button: {
    type: Object as PropType<ButtonProps>,
  },
}

export default defineComponent({
  name: 'PopConfirmButton',
  inheritAttrs: false,
  props,
  emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    const { t } = useTransl()

    const getBindValues = computed(() => {
      return Object.assign(
        {
          confirmButtonText: t('common.basic.confirm'),
          cancelButtonText: t('common.basic.cancel'),
          title: t('component.button.popconfirm.title'),
        },
        {
          ...props,
          ...attrs, // 保持支持原有popconfirm属性
          onConfirm: () => {
            emit('click')
          },
        }
      )
    })

    return () => {
      const ElPopconfirm = resolveComponent('ElPopconfirm') as ConcreteComponent
      const ElButton = resolveComponent('ElButton') as ConcreteComponent

      const Button = h(ElButton, unref(getBindValues).button, extendSlots(slots))

      const bindValues = omit(unref(getBindValues), 'button')
      return h(ElPopconfirm, bindValues, { reference: () => Button })
    }
  },
})
</script>
