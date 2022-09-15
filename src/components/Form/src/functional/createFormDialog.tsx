import type { BasicFormActionType, BasicFormProps } from '../typing'
import type { BasicDialogProps, BasicDialogActionType } from '/@/components/Dialog'
import type { SetupContext, ComponentInternalInstance } from 'vue'

import { BasicDialog } from '/@/components/Dialog'
import BasicForm from '../BasicForm.vue'
import { ref, unref, render, createVNode, nextTick } from 'vue'
import { globalAppContext } from '/@/components/registerGlobalComp'
import { isFunction, merge } from 'lodash-es'
import { tryOnUnmounted } from '@vueuse/core'

interface FormDialogProps {
  formProps: BasicFormProps
  dialogProps: BasicDialogProps
  handleSubmit: (
    res: Recordable,
    dialogAction: BasicDialogActionType,
    formAction: BasicFormActionType
  ) => void | Promise<void>
}

type OnOpenFn = (
  dialogAction: BasicDialogActionType,
  formAction: BasicFormActionType
) => void | Promise<void>

export function createFormDialog(createProps?: Partial<FormDialogProps>) {
  const dialogRef = ref<Nullable<BasicDialogActionType>>(null)
  const formRef = ref<Nullable<BasicFormActionType>>(null)

  tryOnUnmounted(() => {
    dialogRef.value = null
    formRef.value = null
  })

  // FormDialog FunctionalComponent
  const FormDialogRender = (props: Partial<FormDialogProps>, context: SetupContext) => {
    const dialogProps = {
      ...(props.dialogProps || {}),
      destroyOnClose: true,
      onConfirm: unref(formRef)?.submit,
      onCancel: () => {
        //关闭时重置表单值
        unref(formRef)?.resetFields()
      },
    }

    // hook onSubmit
    function handleSubmit(res: Recordable) {
      if (props.handleSubmit && isFunction(props.handleSubmit)) {
        props.handleSubmit(res, unref(dialogRef)!, unref(formRef)!)
      }
    }

    const formProps = {
      ...(props.formProps || {}),
      showActionButtonGroup: false,
      onSubmit: handleSubmit,
    }

    return (
      <BasicDialog ref={dialogRef} {...dialogProps}>
        <BasicForm ref={formRef} {...formProps} v-slots={context.slots} />
      </BasicDialog>
    )
  }

  // normalized to camelCase unless the props option is specified.
  FormDialogRender.props = ['dialogProps', 'formProps', 'handleSubmit']
  FormDialogRender.emits = ['submit']

  // init vnode without template
  let _fdInstance: ComponentInternalInstance | null

  function initVNode() {
    // 在模板中使用，那么无需手动初始化，直接操作使用FormDialogRender操作即可
    // 但请注意使用时机，必须保证在mounted后操作
    // 如果不在模板中使用则需要手动创建节点
    // 手动创建节点会在关闭Dialog时直接销毁DOM节点，避免无法销毁导致内存泄漏
    if (unref(dialogRef)) return

    // vnode is created
    if (_fdInstance) return

    const container = document.createElement('div')

    // hack onClosed hook to gc this dom
    function onClosed() {
      nextTick(() => {
        // here we were suppose to call document.body.removeChild(container.firstElementChild)
        // but render(null, container) did that job for us. so that we do not call that directly
        render(null, container)
        _fdInstance = null
      })
    }

    const vnodeProps = merge(createProps, { dialogProps: { onClosed } })

    // vnode
    const vm = createVNode(FormDialogRender, vnodeProps)
    // useing App context
    vm.appContext = globalAppContext
    render(vm, container)
    document.body.appendChild(container.firstElementChild!)

    // created done
    _fdInstance = vm.component!
  }

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

    if (isFunction(onOpen)) {
      nextTick(() => {
        onOpen(unref(dialogRef)!, unref(formRef)!)
      })
    }
  }

  function close() {
    setDialogProps({ visible: false })
  }

  // mouted action
  FormDialogRender.setDialogProps = setDialogProps
  FormDialogRender.setFormProps = setFormProps
  FormDialogRender.open = open
  FormDialogRender.close = close

  return FormDialogRender
}
