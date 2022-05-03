<template>
  <div :class="getWrapperClass">
    <PageHeader 
      v-if="headerContent || $slots.headerContent || title" 
      :title="title">
      <template #default>
        <template v-if="headerContent">
          <span>{{ headerContent }}</span>
        </template>
        <slot name="headerContent" v-else></slot>
      </template>
    </PageHeader>

    <div class="overflow-hidden"></div>
  </div>
</template>

<script lang="ts">
import type { CSSProperties, PropType } from 'vue'

import { defineComponent, computed } from 'vue'
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
    dense: {
      type: Boolean,
      default: false
    },
    headerContent: {
      type: String,
      default: null
    },
    contentStyle: {
      type: Object as PropType<CSSProperties>
    },
    contentClass: {
      type: String,
      default: ''
    },
    contentBackground: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { attrs }) {
    const { prefixCls } = useDesign('page-wrapper')

    const getWrapperClass = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}--dense`]: props.dense
        },
        attrs.class || {}
      ]
    })

    return {
      getWrapperClass
    }
  }
})
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-page-wrapper;

.#{$prefixCls} {
  position: relative;

  &--dense {
    .#{$prefixCls}-content {
      margin: 0;
    }
  }

  &-content {
    margin: 20px;
  }

  &-content-bg {
    background-color: var.$color-white;
  }
}
</style>
