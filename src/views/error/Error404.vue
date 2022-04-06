<template>
  <main
    class="relative flex items-center justify-center h-full w-full overflow-hidden bg-white text-black"
    :class="prefixCls"
  >
    <span
      class="absolute block"
      :class="`${prefixCls}__particle`"
      v-for="i in MAX_RANDOM_SIZE"
      :key="i"
    >0</span>
    <span
      class="absolute block"
      :class="`${prefixCls}__particle`"
      v-for="i in MAX_RANDOM_SIZE"
      :key="i"
    >4</span>
    <article
      :class="`${prefixCls}__content`"
      class="relative w-[500px] max-w-full m-5 bg-white text-center py-[60px] px-[40px] rounded-sm"
    >
      <p class="mb-4 text-base text-gray-600">该页面无法正常打开...</p>
      <p class="mb-4 text-xs text-gray-400">请检查链接是否输入正确, 或点击按钮返回首页</p>
      <ElButton class="mt-2" @click="go()">返回首页</ElButton>
    </article>
  </main>
</template>

<script setup lang="ts">
import { useDesign } from '/@/hooks/core/useDesign'
import { useGo } from '/@/hooks/web/useGo'

const MAX_RANDOM_SIZE = Object.freeze(40)
const go = useGo()
const { prefixCls } = useDesign('error404')
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-error404;

$anims: float, floatReverse, float2, floatReverse2;
$easeSmooth: cubic-bezier(0.39, 0.575, 0.28, 0.995);

@mixin animation($delay, $duration, $animation) {
  animation-delay: $delay;
  animation-duration: $duration;
  animation-name: $animation;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
}

.#{$prefixCls} {
  &__particle {
    pointer-events: none;

    @for $i from 1 through 80 {
      &:nth-child(#{$i}) {
        $size: random(20) + 10;
        $blur: $i * 0.02;
        $speed: random(20) + 20;
        $delay: random(10) * 0.1;
        $anim: nth($anims, random(length($anims)));

        top: calc(random(100) / (100 + $size/8) * 100%);
        left: calc(random(100) / (100 + $size/10) * 100%);
        font-size: $size + px;
        filter: blur((#{$blur}) + px);
        animation: $speed + s $anim infinite;
      }
    }
  }

  &__content {
    box-shadow: -10px 10px 67px -12px rgba(0, 0, 0, 0.2);
    animation: apparition 0.8s $easeSmooth forwards;
    opacity: 0;
  }

  @keyframes apparition {
    from {
      opacity: 0;
      transform: translateY(100px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(180px);
    }
  }

  @keyframes floatReverse {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-180px);
    }
  }

  @keyframes float2 {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(28px);
    }
  }

  @keyframes floatReverse2 {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-28px);
    }
  }
}
</style>
