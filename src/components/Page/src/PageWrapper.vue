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
import { CSSProperties } from 'vue'

import { defineComponent, computed, ref, watch, provide, unref } from 'vue'
import { PageWrapperFixedHeightKey } from '..'
import PageHeader from './PageHeader.vue'
import { useDesign } from '/@/composables/core/useDesign'
import { useRootSetting } from '/@/composables/setting/useRootSetting'
import { useContentHeight } from '/@/composables/web/useContentHeight'
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
    const { contentHeight, redoHeight } = useContentHeight(
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

      const height = `${contentHeight.value}px`
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
        contentClass,
        {
          [`${prefixCls}-content-bg`]: contentBackground,
        },
      ]
    })

    // 是否需要重新计算content height
    const { getFullContent } = useRootSetting()
    watch(
      () => getFullContent.value,
      () => {
        redoHeight()
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

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-page-wrapper;

.#{$prefixCls} {
  position: relative;
  // https://juejin.cn/post/7086740810238509070
  // fix margin塌陷
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
    background-color: var(--el-bg-color-overlay);
  }
}
</style>
