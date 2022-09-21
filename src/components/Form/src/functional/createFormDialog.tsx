import type { BasicFormActionType, BasicFormProps } from '../typing'
import type { BasicDialogProps, BasicDialogActionType } from '/@/components/Dialog'
import type { ComponentInternalInstance, Ref, ExtractPropTypes } from 'vue'

import { BasicDialog } from '/@/components/Dialog'
import BasicForm from '../BasicForm.vue'
import {
  unref,
  render,
  createVNode,
  nextTick,
  getCurrentInstance,
  onUnmounted,
  ref,
  defineComponent,
} from 'vue'
import { globalAppContext } from '/@/components/registerGlobalComp'
import { isFunction, merge } from 'lodash-es'

const basicProps = {
  formProps: {
    type: Object as PropType<BasicFormProps>,
  },
  dialogProps: {
    type: Object as PropType<BasicDialogProps>,
  },
  submit: {
    type: Function as PropType<OnSubmitFn>,
  },
}

type OnSubmitFn = (res: Recordable, ist: FormDialogInstance) => void | Promise<void>

type OnOpenFn = (ist: FormDialogInstance) => void | Promise<void>

type FormDialogProps = ExtractPropTypes<typeof basicProps>

interface FormDialogInstance {
  open: (fn?: OnOpenFn) => void | Promise<void>
  close: () => void
  showLoading: () => void
  hideLoading: () => void
  getDialogAction: () => Nullable<BasicDialogActionType>
  getFormAction: () => Nullable<BasicFormActionType>
}

export function createFormDialog(
  createProps?: Partial<FormDialogProps>,
  fdRef?: Ref<Nullable<FormDialogInstance>>
) {
  // 判断是否在setup中调用，用于判断是否能在生命周期中释放资源
  const isRunInSetup = !!getCurrentInstance()

  const container = document.createElement('div')
  let _componentInstance: ComponentInternalInstance | null = null

  function release() {
    // here we were suppose to call document.body.removeChild(container.firstElementChild)
    // but render(null, container) did that job for us. so that we do not call that directly
    render(null, container)

    _componentInstance = null
  }

  if (!isRunInSetup) {
    // hack onClosed hook to gc this dom
    function onClosed() {
      nextTick(() => {
        release()
      })
    }

    createProps = merge(createProps, { dialogProps: { onClosed } })
  } else {
    onUnmounted(() => {
      release()
    })
  }

  function getInstance(): Nullable<FormDialogInstance> {
    if (fdRef) return unref(fdRef)

    // inited return
    if (!_componentInstance) {
      const vm = createVNode(BasicFormDialog, createProps)
      vm.appContext = globalAppContext

      render(vm, container)
      document.body.appendChild(container.firstElementChild!)

      _componentInstance = vm.component!
    }

    return _componentInstance.exposed as Nullable<FormDialogInstance>
  }

  return {
    open: (fn?: OnOpenFn) => {
      getInstance()?.open(fn)
    },
    close: () => {
      getInstance()?.close()
    },
    getDialogAction: () => {
      return getInstance()?.getDialogAction()
    },
    getFormAction: () => {
      return getInstance()?.getFormAction()
    },
    showLoading: () => {
      getInstance()?.showLoading()
    },
    hideLoading: () => {
      getInstance()?.hideLoading()
    },
  }
}

export const BasicFormDialog = defineComponent({
  name: 'BasicFormDialog',
  inheritAttrs: false,
  props: basicProps,
  setup(props, { expose, slots }) {
    const dialogRef = ref<Nullable<BasicDialogActionType>>(null)
    const formRef = ref<Nullable<BasicFormActionType>>(null)

    const action = {
      getDialogAction,
      getFormAction,
      open,
      close,
      showLoading,
      hideLoading,
    }

    function getDialogAction() {
      return unref(dialogRef)
    }

    function getFormAction() {
      return unref(formRef)
    }

    // expose operate function
    function open(open?: OnOpenFn) {
      getDialogAction()?.setProps({ visible: true })

      nextTick(() => {
        if (open && isFunction(open)) {
          open(action)
        }
      })
    }

    function close() {
      getDialogAction()?.setProps({ visible: false })
    }

    function showLoading() {
      getDialogAction()?.setProps({ loading: true, confirmBtnProps: { loading: true } })
    }

    function hideLoading() {
      getDialogAction()?.setProps({ loading: false, confirmBtnProps: { loading: false } })
    }

    expose(action)

    return () => {
      const dialogProps = {
        destroyOnClose: true,
        ...(props.dialogProps || {}),
        onConfirm: unref(formRef)?.submit,
        onCancel: () => {
          //关闭时重置表单值
          unref(formRef)?.resetFields()
        },
      }

      // hook onSubmit
      function handleSubmit(res: Recordable) {
        if (props.submit && isFunction(props.submit)) {
          props.submit(res, action)
        }
      }

      const formProps = {
        ...(props.formProps || {}),
        showActionButtonGroup: false,
        onSubmit: handleSubmit,
      }

      return (
        <BasicDialog ref={dialogRef} {...dialogProps}>
          <BasicForm ref={formRef} {...formProps} v-slots={slots} />
        </BasicDialog>
      )
    }
  },
})
