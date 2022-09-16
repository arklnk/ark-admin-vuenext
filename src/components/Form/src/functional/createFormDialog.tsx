import type { BasicFormActionType, BasicFormProps } from '../typing'
import type { BasicDialogProps, BasicDialogActionType } from '/@/components/Dialog'
import type { ComponentInternalInstance } from 'vue'

import { BasicDialog } from '/@/components/Dialog'
import BasicForm from '../BasicForm.vue'
import { ref, unref, render, createVNode, nextTick, getCurrentInstance, onUnmounted } from 'vue'
import { globalAppContext } from '/@/components/registerGlobalComp'
import { isFunction, merge } from 'lodash-es'

type OnSubmitFn = (
  res: Recordable,
  dialogAction: BasicDialogActionType,
  formAction: BasicFormActionType
) => void | Promise<void>

type OnOpenFn = (
  dialogAction: BasicDialogActionType,
  formAction: BasicFormActionType
) => void | Promise<void>

interface FormDialogProps {
  formProps: BasicFormProps
  dialogProps: BasicDialogProps
  submit: OnSubmitFn
}

export function createFormDialog(createProps?: Partial<FormDialogProps>) {
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
        props.submit(res, unref(dialogRef)!, unref(formRef)!)
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
  FormDialogRender.props = ['dialogProps', 'formProps', 'handleSubmit']

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
    if (_componentInstance) return

    const vm = createVNode(FormDialogRender, createProps)
    vm.appContext = globalAppContext

    render(vm, container)
    document.body.appendChild(container.firstElementChild!)

    _componentInstance = vm.component!
  }

  // expose operate function
  function setDialogProps(props: BasicDialogProps) {
    initVNode()

    unref(dialogRef)?.setProps(props)
  }

  function setFormProps(props: BasicFormProps) {
    initVNode()

    unref(formRef)?.setProps(props)
  }

  function open(onOpen?: OnOpenFn) {
    setDialogProps({ visible: true })

    if (onOpen && isFunction(onOpen)) {
      nextTick(() => {
        onOpen(unref(dialogRef)!, unref(formRef)!)
      })
    }
  }

  function close() {
    setDialogProps({ visible: false })
  }

  return {
    setDialogProps,
    setFormProps,
    open,
    close,
  }
}
