<template>
  <div :class="prefixCls">
    <PageHeader 
      v-if="headerContent || $slots.headerContent || title" 
      :title="title">
      <template #default>
        <template v-if="headerContent">
          <span>{{ headerContent }}</span>
        </template>
        <slot name="headerContent"></slot>
      </template>
    </PageHeader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PageHeader from './PageHeader.vue'
import { useDesign } from '/@/hooks/core/useDesign'

export default defineComponent({
  name: 'PageWrapper',
  components: { PageHeader },
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: ''
    },
    headerContent: {
      type: String,
      default: null
    }
  },
  setup() {
    const { prefixCls } = useDesign('page-wrapper')

    return {
      prefixCls
    }
  }
})
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-page-wrapper;

.#{$prefixCls} {
  position: relative;
}
</style>
