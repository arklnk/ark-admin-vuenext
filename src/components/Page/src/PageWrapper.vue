<template>
  <div ref="wrapperRef" :class="getWrapperClass">
    <PageHeader
      ref="headerRef"
      v-if="headerContent || $slots.headerContent || title"
      :title="title"
    >
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
import { CSSProperties, PropType, unref } from 'vue'

import { defineComponent, computed, ref, watch } from 'vue'
import PageHeader from './PageHeader.vue'
import { useDesign } from '/@/hooks/core/useDesign'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'
import { useContentHeight } from '/@/hooks/web/useContentHeight'
import { useLayoutHeight } from '/@/layouts/default/content/useLayoutHeight'

export default defineComponent({
  name: 'PageWrapper',
  components: { PageHeader },
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: '',
    },
    dense: {
      type: Boolean,
      default: false,
    },
    fixedHeight: {
      type: Boolean,
      default: false,
    },
    headerContent: {
      type: String,
      default: null,
    },
    contentStyle: {
      type: Object as PropType<CSSProperties>,
    },
    contentClass: {
      type: String,
      default: '',
    },
    contentBackground: {
      type: Boolean,
      default: true,
    },
    upwardSpace: {
      type: [Number, String],
      default: 0,
    },
    // 内容区域高度是否计算上Footer
    includeFooter: {
      type: Boolean,
      default: false
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
          [`${prefixCls}--dense`]: props.dense,
        },
        attrs.class || {},
      ]
    })

    const { appFooterHeightRef } = useLayoutHeight()
    const getIsFixdHeight = computed(() => props.fixedHeight)
    const getUpwardSpace = computed(() => props.upwardSpace)
    const getFooterOffsetHeight = computed(() => {
      return props.includeFooter ? unref(appFooterHeightRef) : 0
    })
    const { contentHeight, recalcHeight } = useContentHeight(
      getIsFixdHeight,
      wrapperRef,
      [headerRef],
      [contentRef],
      getUpwardSpace,
      getFooterOffsetHeight
    )
    const getContentStyle = computed((): CSSProperties => {
      const { fixedHeight, contentStyle } = props

      if (!fixedHeight) {
        return {
          ...contentStyle,
        }
      }

      let height = `${contentHeight.value}px`
      return {
        ...contentStyle,
        ...{ height },
      }
    })

    const getContentClass = computed(() => {
      const { contentClass, contentBackground } = props
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-bg`]: contentBackground,
        },
        contentClass,
      ]
    })

    // 是否需要重新计算content height
    const { getFullContent, getShowFooter } = useRootSetting()
    watch(
      () => [getFullContent.value, getShowFooter.value],
      () => {
        recalcHeight()
      },
      {
        flush: 'post',
        immediate: true
      }
    )

    return {
      wrapperRef,
      headerRef,
      contentRef,

      getWrapperClass,
      getContentClass,
      getContentStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-page-wrapper;

.#{$prefixCls} {
  position: relative;
  // 解决content margin高度塌陷 BFC
  overflow: hidden;

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
