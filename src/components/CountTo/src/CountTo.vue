<template>
  <span>{{ value }}</span>
</template>

<script lang="ts">
import { TransitionPresets, useTransition } from '@vueuse/core'
import { computed, defineComponent, onMounted, ref, unref, watchEffect, watch } from 'vue'
import { isNumber } from 'lodash-es'

const props = {
  startVal: {
    type: Number,
    default: 0,
  },
  endVal: {
    type: Number,
    default: 100,
  },
  duration: {
    type: Number,
    default: 1500,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  /**
   * the number of decimal places to show
   */
  decimals: {
    type: Number,
    default: 0,
    validator(v: number) {
      return v >= 0
    },
  },
  /**
   * the split decimal
   */
  decimal: {
    type: String,
    default: '.',
  },
  separator: {
    type: String,
    default: '.',
  },
  useEasing: {
    type: Boolean,
    default: true,
  },
  /**
   * https://vueuse.org/core/usetransition/#usage
   * like TransitionPresets constants
   */
  transition: {
    type: String,
    default: 'linear',
  },
}

export default defineComponent({
  name: 'CountTo',
  props,
  emits: ['onStarted', 'onFinished'],
  setup(props, { emit }) {
    const sourceRef = ref(props.startVal)
    const diasbledRef = ref(false)

    let outputVal = useTransition(sourceRef)
    const value = computed(() => formatNumber(unref(outputVal)))

    watchEffect(() => {
      sourceRef.value = props.startVal
    })

    watch(
      () => [props.startVal, props.endVal],
      () => {
        props.autoplay && start()
      }
    )

    onMounted(() => {
      props.autoplay && start()
    })

    function start() {
      run()
      sourceRef.value = props.endVal
    }

    function reset() {
      sourceRef.value = props.startVal
      run()
    }

    function run() {
      outputVal = useTransition(sourceRef, {
        disabled: diasbledRef,
        duration: props.duration,
        onFinished: () => emit('onStarted'),
        onStarted: () => emit('onFinished'),
        ...(props.useEasing
          ? {
              transition: TransitionPresets[props.transition],
            }
          : {}),
      })
    }

    function formatNumber(num: number | string) {
      if (!num && num !== 0) {
        return ''
      }
      const { decimals, decimal, separator, suffix, prefix } = props
      num = Number(num).toFixed(decimals)
      num += ''

      const x = num.split('.')
      let x1 = x[0]
      const x2 = x.length > 1 ? decimal + x[1] : ''

      const rgx = /(\d+)(\d{3})/
      if (separator && !isNumber(separator)) {
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + separator + '$2')
        }
      }
      return prefix + x1 + x2 + suffix
    }

    return { value, start, reset }
  },
})
</script>
