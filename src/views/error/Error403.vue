<template>
  <div class="flex items-center justify-center w-full h-full bg-gray-200">
    <div :class="prefixCls">
      <div :class="`${prefixCls}__icon`"></div>
      <h1>访问被拒绝</h1>
      <p>
        请联系管理员进行申请必要权限, 或
        <span class="cursor-pointer font-semibold" @click="reSign">重新登录</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PageEnum } from '/@/enums/pageEnum'
import { useDesign } from '/@/hooks/core/useDesign'
import { useGo } from '/@/hooks/web/useGo'
import { useUserStore } from '/@/stores/modules/user'

const userStore = useUserStore()
const go = useGo()
const { prefixCls } = useDesign('error403')

function reSign() {
  userStore.logout().finally(() => go(PageEnum.Login, true))
}
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-error403;

$bg: white;
$color: #ef5350;
$size: 4rem;

.#{$prefixCls} {
  background: $bg;
  font-family: Montserrat, sans-serif;
  height: auto;
  width: 40vw;
  padding: 1.5rem;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  text-align: center;

  &__icon {
    margin: auto;
    width: calc($size + ($size/6));
    height: calc($size + ($size/6));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color;
    animation: grow 1s forwards;

    &::before {
      position: absolute;
      background-color: $bg;
      border-radius: 50%;
      content: "";
      width: $size;
      height: $size;
      transform: scale(0);

      animation: grow2 0.5s forwards 0.5s;
    }

    &::after {
      content: "";
      z-index: 2;
      position: absolute;
      width: $size;
      height: calc($size/12);
      transform: scaley(0) rotateZ(0deg);
      background: $color;
      animation: grow3 0.5s forwards 1s;
    }
  }

  h1 {
    font-size: 1.25rem;
    margin: 0;
    margin-top: 1rem;
    color: #263238;
    opacity: 0;
    transform: translateX(-0.1rem);
    animation: fadeIn 1s forwards 1.5s;
  }

  p {
    margin: 0;
    margin-top: 0.5rem;
    color: #546e7a;
    opacity: 0;
    transform: translateX(-0.1rem);
    animation: fadeIn 1s forwards 1.75s;
  }

  @keyframes fadeIn {
    from {
      transform: translateY(1rem);
      opacity: 0;
    }

    to {
      transform: translateY(0rem);
      opacity: 1;
    }
  }

  @keyframes grow {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1);
    }
  }

  @keyframes grow2 {
    from {
      transform: scale(0);
    }

    to {
      transform: scale(1);
    }
  }

  @keyframes grow3 {
    from {
      transform: scaley(0) rotateZ(0deg);
    }

    to {
      transform: scaley(1) rotateZ(-45deg);
    }
  }
}
</style>
