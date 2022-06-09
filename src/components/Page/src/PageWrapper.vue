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
import { CSSProperties, PropType, provide, unref } from 'vue'

import { defineComponent, computed, ref, watch } from 'vue'
import { PageWrapperFixedHeightKey } from '..'
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
    /**
     * 是否取消margin
     */
    dense: {
      type: Boolean,
      default: false,
    },
    /**
     * 固定高度影响height
     */
    fixedHeight: {
      type: Boolean,
      default: false,
    },
    /**
     * 占满高度影响min-height
     */
    contentFullHeight: {
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
    /**
     * 是否使用自带的背景颜色
     */
    contentBackground: {
      type: Boolean,
      default: true,
    },
    upwardSpace: {
      type: [Number, String],
      default: 0,
    },
    /**
     * 当contentFullHeight启用时内容区域高度是否计算上Footer
     */
    includeFooter: {
      type: Boolean,
      default: false,
    },
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

    provide(
      PageWrapperFixedHeightKey,
      computed(() => props.fixedHeight)
    )

    const { appFooterHeightRef } = useLayoutHeight()
    const getContentFullHeight = computed(() => props.contentFullHeight)
    const getUpwardSpace = computed(() => props.upwardSpace)
    const getFooterOffsetHeight = computed(() => {
      return props.includeFooter ? unref(appFooterHeightRef) : 0
    })
    const { contentHeight, recalcHeight } = useContentHeight(
      getContentFullHeight,
      wrapperRef,
      [headerRef],
      [contentRef],
      getUpwardSpace,
      getFooterOffsetHeight
    )
    const getContentStyle = computed((): CSSProperties => {
      const { contentStyle, contentFullHeight, fixedHeight } = props

      if (!contentFullHeight) {
        return {
          ...contentStyle,
        }
      }

      let height = `${contentHeight.value}px`
      return {
        ...contentStyle,
        minHeight: height,
        ...(fixedHeight ? { height } : {}),
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
        immediate: true,
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
    overflow: auto;
  }

  &-content-bg {
    background-color: var.$color-white;
  }
}

html.dark {
  .#{$prefixCls} {
    &-content-bg {
      background-color: var.$app-page-dark-bg-color;
    }
  }
}
</style>
