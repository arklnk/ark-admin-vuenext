<template>
  <div ref="wrapperRef" :class="getWrapperClass">
    <PageHeader
      ref="headerRef"
      v-if="headerContent || $slots.headerContent || title" 
      :title="title">
      <template #default>
        <template v-if="headerContent">
          <span>{{ headerContent }}</span>
        </template>
        <slot name="headerContent" v-else></slot>
      </template>
    </PageHeader>

    <div ref="contentRef" :class="getContentClass" :style="getContentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { CSSProperties, PropType, ref } from 'vue'

import { defineComponent, computed } from 'vue'
import PageHeader from './PageHeader.vue'
import { useDesign } from '/@/hooks/core/useDesign'
import { useContentHeight } from '/@/hooks/web/useContentHeight'

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
    fixedHeight: {
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
      default: true
    },
    upwardSpace: {
      type: [Number, String],
      default: 0
    }
  },
  setup(props, { attrs }) {
    const wrapperRef = ref(null)
    const headerRef = ref(null)
    const contentRef = ref(null)

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

    const getIsFixdHeight = computed(() => props.fixedHeight)
    const getUpwardSpace = computed(() => props.upwardSpace)
    const { contentHeight } = useContentHeight(getIsFixdHeight, wrapperRef, [headerRef], [contentRef], getUpwardSpace)
    const getContentStyle = computed((): CSSProperties => {
      const { fixedHeight, contentStyle } = props

      if (!fixedHeight) {
        return {
          ...contentStyle
        }
      }

      const height = `${contentHeight.value}px`
      return {
        ...contentStyle,
        ...{ height }
      }
    })

    const getContentClass = computed(() => {
      const { contentClass, contentBackground } = props
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-bg`]: contentBackground
        },
        contentClass
      ]
    })

    return {
      wrapperRef,
      headerRef,
      contentRef,

      getWrapperClass,
      getContentClass,
      getContentStyle
    }
  }
})
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-page-wrapper;

.#{$prefixCls} {
  position: relative;
  overflow: hidden;
  // display: flex;
  // flex-direction: column;

  &--dense {
    .#{$prefixCls}-content {
      margin: 0;
    }
  }

  &-content {
    margin: 16px;
  }

  &-content-bg {
    background-color: var.$color-white;
  }
}
</style>
