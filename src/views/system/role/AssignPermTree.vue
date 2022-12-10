<template>
  <ElTree
    class="h-52 w-full overflow-auto border border-bd hover:border-disabled rounded-sm"
    ref="treeRef"
    :data="data"
    node-key="id"
    show-checkbox
    :props="treeProps"
    @check="handleCheck"
  />
</template>

<script setup lang="ts">
import type { MenuResult } from '/@/api/system/menu'
import type { ElTree } from 'element-plus'

import { defineComponent, onMounted, ref, unref, watch } from 'vue'

const props = defineProps({
  data: Array,
  modelValue: Array as PropType<number[]>,
})

const emit = defineEmits(['update:modelValue', 'change'])

const treeProps: any = {
  label: (data: MenuResult): string => {
    return data.name
  },
}

const treeRef = ref<InstanceType<typeof ElTree>>()

onMounted(() => {
  updateCheckedNode(props.modelValue)
})

watch(
  () => props.modelValue,
  (v) => {
    updateCheckedNode(v)
  }
)

function updateCheckedNode(keys: number[] = []) {
  keys.forEach((key) => {
    const node = unref(treeRef)?.getNode(key)
    if (node && node.isLeaf) {
      unref(treeRef)?.setChecked(key, true, false)
    }
  })
}

function handleCheck(_, { checkedKeys, halfCheckedKeys }) {
  const allKeys = [...checkedKeys, ...halfCheckedKeys]
  emit('update:modelValue', allKeys)
  emit('change', allKeys)
}
</script>

<script lang="ts">
export default defineComponent({
  inheritAttrs: false,
})
</script>
