<template>
  <span v-for="(action, index) in getActions" :key="`${index}`">{{ action.label }}</span>
</template>

<script lang="ts">
import type { TableActionItem } from '../types/action'

import { computed, defineComponent } from 'vue'
import { usePermission } from '/@/composables/core/usePermission'
import { isNil } from 'lodash-es'

export default defineComponent({
  name: 'BasicTableAction',
  props: {
    actions: {
      type: Array as PropType<TableActionItem[]>,
      default: null,
    },
  },
  setup(props) {
    const { hasPermission } = usePermission()

    const getActions = computed(() => {
      return (props.actions || []).filter((act) => {
        // 未定义则不做判断
        if (isNil(act.permission)) return true

        return hasPermission(act.permission)
      })
    })

    return {
      getActions,
    }
  },
})
</script>
