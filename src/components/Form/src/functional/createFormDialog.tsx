import type { BasicFormActionType, BasicFormProps } from '../typing'
import type { BasicDialogProps, BasicDialogActionType } from '/@/components/Dialog'
import type { ComponentInternalInstance } from 'vue'

import { BasicDialog } from '/@/components/Dialog'
import BasicForm from '../BasicForm.vue'
import { ref, unref, render, createVNode, nextTick, getCurrentInstance, onUnmounted } from 'vue'
import { globalAppContext } from '/@/components/registerGlobalComp'
import { isFunction, merge } from 'lodash-es'

type OnSubmitFn = (res: Recordable, ist: FormDialogInstance) => void | Promise<void>

type OnOpenFn = (ist: FormDialogInstance) => void | Promise<void>

interface FormDialogProps {
  formProps: BasicFormProps
  dialogProps: BasicDialogProps
  submit: OnSubmitFn
}

interface FormDialogInstance {
  open: (fn?: OnOpenFn) => void | Promise<void>
  close: () => void
  showLoading: () => void
  hideLoading: () => void
  getDialogAction: () => Nullable<BasicDialogActionType>
  getFormAction: () => Nullable<BasicFormActionType>
}

export function createFormDialog(createProps?: Partial<FormDialogProps>): FormDialogInstance {
  const dialogRef = ref<Nullable<BasicDialogActionType>>(null)
  const formRef = ref<Nullable<BasicFormActionType>>(null)

  // 判断是否在setup中调用，用于判断是否能在生命周期中释放资源
  const isRunInSetup = !!getCurrentInstance()

  // FormDialog FunctionalComponent
  const FormDialogRender = (props: Partial<FormDialogProps>) => {
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
        <BasicForm ref={formRef} {...formProps} />
      </BasicDialog>
    )
  }

  // normalized to camelCase unless the props option is specified.
  FormDialogRender.props = ['dialogProps', 'formProps', 'submit']

  const container = document.createElement('div')
  let _componentInstance: ComponentInternalInstance | null = null

  function release() {
    // here we were suppose to call document.body.removeChild(container.firstElementChild)
    // but render(null, container) did that job for us. so that we do not call that directly
    render(null, container)

    dialogRef.value = null
    formRef.value = null
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

  // lazy init
  function initVNode() {
    // inited return
    if (_componentInstance) return

    const vm = createVNode(FormDialogRender, createProps)
    vm.appContext = globalAppContext

    render(vm, container)
    document.body.appendChild(container.firstElementChild!)

    _componentInstance = vm.component!
  }

  function getDialogAction() {
    initVNode()

    return unref(dialogRef)
  }

  function getFormAction() {
    initVNode()

    return unref(formRef)
  }

  // expose operate function
  function open(onOpen?: OnOpenFn) {
    getDialogAction()?.setProps({ visible: true })

    if (onOpen && isFunction(onOpen)) {
      nextTick(() => {
        onOpen(action)
      })
    }
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

  const action: FormDialogInstance = {
    getDialogAction,
    getFormAction,
    open,
    close,
    showLoading,
    hideLoading,
  }

  return action
}
