import type { BasicDialogActionType, BasicDialogProps, UseDialogDialogActionType } from '../typing'

import { onUnmounted, reactive, ref, unref } from 'vue'
import { error } from '/@/utils/log'

// store the parameters passed when opening the pop-up window
const store = reactive<any>({})

type RegisterFn = (action: BasicDialogActionType, uid: number) => void

export function useDialog(): [RegisterFn, UseDialogDialogActionType] {
  const dialogRef = ref<Nullable<BasicDialogActionType>>(null)
  const loadedRef = ref<boolean>(false)
  const uidRef = ref<number>(-1)

  function register(action: BasicDialogActionType, uid: number) {
    uidRef.value = uid

    onUnmounted(() => {
      dialogRef.value = null
      loadedRef.value = false
      store[unref(uidRef.value)] = null
    })

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

  const methods: UseDialogDialogActionType = {
    setProps: (props: Partial<BasicDialogProps>) => {
      getInstance()?.setProps(props)
    },
    openDialog: <T = any>(data?: T) => {
      getInstance()?.setProps({ visible: true })

      if (!data) return
    },
    closeDialog: () => {
      getInstance()?.setProps({ visible: false })
    },
  }

  return [register, methods]
}
