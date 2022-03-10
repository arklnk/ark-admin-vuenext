<template>
  <div v-if="route.meta?.hidden"></div>
</template>

<script lang="ts">
export default {
  name: 'SideMenu'
}
</script>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { PropType } from 'vue'

defineProps({
  route: {
    type: Object as PropType<RouteRecordRaw>,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})
</script>
