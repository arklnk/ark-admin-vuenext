<template>
  <div>TableAction</div>
</template>

<script setup lang="ts">
import { usePermission } from '/@/composables/core/usePermission'

defineProps({})

const {} = usePermission()
</script>
