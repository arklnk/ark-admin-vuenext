import type {
  BasicDrawerActionType,
  UseDrawerReturnType,
  UseDrawerInnerReturnType,
  ExtraBasicDrawerActionType,
  BasicDrawerProps,
} from '../typing'

import {
  getCurrentInstance,
  nextTick,
  onUnmounted,
  reactive,
  ref,
  toRaw,
  unref,
  watchEffect,
} from 'vue'
import { error } from '/@/utils/log'
import { isProdMode } from '/@/utils/env'
import { isEqual, isFunction, isNil } from 'lodash-es'

// store the parameters passed when opening the pop-up window
const store = reactive<{ [key: number]: any }>({})

export function useDrawer(): UseDrawerReturnType {
  const drawerRef = ref<Nullable<BasicDrawerActionType>>(null)
  const loadedRef = ref<boolean>(false)
  const uidRef = ref<number>(-1)

  function register(action: BasicDrawerActionType, uid: number) {
    if (!getCurrentInstance()) {
      error('useDrawer() can only be used inside setup() or functional components!')
    }

    uidRef.value = uid

    if (isProdMode()) {
      onUnmounted(() => {
        drawerRef.value = null
        loadedRef.value = false
        store[unref(uidRef.value)] = null
      })
    }

    if (unref(loadedRef) && isProdMode() && action === unref(drawerRef)) return

    drawerRef.value = action
    loadedRef.value = true
  }

  const getInstance = () => {
    const instance = unref(drawerRef)
    if (!instance) {
      error('useDrawer instance is undefined!')
    }
    return instance
  }

  const methods: ExtraBasicDrawerActionType = {
    setProps: (props: Partial<BasicDrawerProps>) => {
      getInstance()?.setProps(props)
    },
    setLoading: (loading = true) => {
      getInstance()?.setProps({ loading })
    },
    setConfirmLoading: (loading = true) => {
      getInstance()?.setProps({ confirmBtnProps: { loading } })
    },
    openDrawer: <T = any>(data?: T, openOnSet = true) => {
      getInstance()?.setProps({ visible: true })

      if (!data) return
      const id = unref(uidRef)
      if (openOnSet) {
        store[id] = null
        store[id] = toRaw(data)
        return
      }

      const equal = isEqual(toRaw(store[id]), toRaw(data))
      if (!equal) {
        store[id] = toRaw(data)
      }
    },
    closeDrawer: () => {
      getInstance()?.setProps({ visible: false })
    },
  }

  return [register, methods]
}

export function useDrawerInner(callbackFn?: Fn): UseDrawerInnerReturnType {
  const drawerRef = ref<Nullable<BasicDrawerActionType>>(null)
  const loadedRef = ref<boolean>(false)
  const uidRef = ref<number>(-1)
  const currentInstance = getCurrentInstance()

  function register(action: BasicDrawerActionType, uid: number) {
    if (!currentInstance) {
      error('useDrawerInner() can only be used inside setup() or functional components!')
    }

    uidRef.value = uid

    if (isProdMode()) {
      onUnmounted(() => {
        drawerRef.value = null
        loadedRef.value = false
      })
    }

    if (unref(loadedRef) && isProdMode() && action === unref(drawerRef)) return

    drawerRef.value = action
    loadedRef.value = true

    // emit current
    currentInstance?.emit('register', action, uid)
  }

  const getInstance = () => {
    const instance = unref(drawerRef)
    if (!instance) {
      error('useDrawerInner instance is undefined!')
    }
    return instance
  }

  watchEffect(() => {
    const data = store[unref(uidRef)]
    if (isNil(data)) return
    if (!callbackFn || !isFunction(callbackFn)) return

    nextTick(() => {
      callbackFn(data)
    })
  })

  return [
    register,
    {
      setProps: (props: Partial<BasicDrawerProps>) => {
        getInstance()?.setProps(props)
      },
      setLoading: (loading = true) => {
        getInstance()?.setProps({ loading })
      },
      setConfirmLoading: (loading = true) => {
        getInstance()?.setProps({ confirmBtnProps: { loading } })
      },
      closeDrawer: () => {
        getInstance()?.setProps({ visible: false })
      },
    },
  ]
}
