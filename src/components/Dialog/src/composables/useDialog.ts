import type {
  BasicDialogActionType,
  BasicDialogProps,
  ExtraBasicDialogActionType,
  UseDialogReturnType,
  UseDialogInnerReturnType,
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
import { isEqual, isFunction, isNil } from 'lodash-es'

// store the parameters passed when opening the pop-up window
const store = reactive<{ [key: number]: any }>({})

export function useDialog(): UseDialogReturnType {
  const dialogRef = ref<Nullable<BasicDialogActionType>>(null)
  const loadedRef = ref<boolean>(false)
  const uidRef = ref<number>(-1)

  function register(action: BasicDialogActionType, uid: number) {
    onUnmounted(() => {
      dialogRef.value = null
      loadedRef.value = false
      store[unref(uidRef.value)] = null
    })

    uidRef.value = uid
    if (unref(loadedRef) && action === unref(dialogRef)) return

    dialogRef.value = action
    loadedRef.value = true
  }

  const getInstance = () => {
    const instance = unref(dialogRef)
    if (!instance) {
      error('useDialog instance is undefined!')
    }
    return instance
  }

  const methods: ExtraBasicDialogActionType = {
    setProps: (props: Partial<BasicDialogProps>) => {
      getInstance()?.setProps(props)
    },
    setLoading: (loading = true) => {
      getInstance()?.setProps({ loading })
    },
    setConfirmLoading: (loading = true) => {
      getInstance()?.setProps({ confirmBtnProps: { loading } })
    },
    openDialog: <T = any>(data?: T, openOnSet = true) => {
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
    closeDialog: () => {
      getInstance()?.setProps({ visible: false })
    },
  }

  return [register, methods]
}

export function useDialogInner(callbackFn?: Fn): UseDialogInnerReturnType {
  const dialogRef = ref<Nullable<BasicDialogActionType>>(null)
  const uidRef = ref<number>(-1)
  const currentInstance = getCurrentInstance()

  function register(action: BasicDialogActionType, uid: number) {
    onUnmounted(() => {
      dialogRef.value = null
    })

    uidRef.value = uid
    dialogRef.value = action
    // 二次封装BasicDialog时可再次抛出该事件，外部使用useDialog可直接再次使用
    currentInstance?.emit('register', action, uid)
  }

  const getInstance = () => {
    const instance = unref(dialogRef)
    if (!instance) {
      error('useDialog instance is undefined!')
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
      setProps: (props: Partial<BasicDialogProps>) => {
        getInstance()?.setProps(props)
      },
      setLoading: (loading = true) => {
        getInstance()?.setProps({ loading })
      },
      setConfirmLoading: (loading = true) => {
        getInstance()?.setProps({ confirmBtnProps: { loading } })
      },
      closeDialog: () => {
        getInstance()?.setProps({ visible: false })
      },
    },
  ]
}
