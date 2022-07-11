<template>
  <div class="h-32 p-10">
    <ElButton @click.right="handleClick">右键</ElButton>
  </div>
</template>

<script setup lang="ts">
import { createContextMenu } from '/@/components/ContextMenu/src/createContextMenu'
import IcBaselineWbSunny from '~icons/ic/baseline-wb-sunny'

function handleClick(e: PointerEvent) {
  createContextMenu({
    event: e,
    items: [
      {
        label: 'dashboard1',
        icon: IcBaselineWbSunny,
        divider: true,
        handler: () => {
          console.log('dashboard')
        },
      },
      {
        label: 'dashboard2',
        icon: IcBaselineWbSunny,
        disabled: true,
        handler: () => {
          console.log('dashboard')
        },
      },
    ],
  })
}
</script>
