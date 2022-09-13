import type { BasicFormActionType, BasicFormProps } from '../typing'
import type { BasicDialogProps, BasicDialogActionType } from '/@/components/Dialog'
import type { SetupContext, ComponentInternalInstance } from 'vue'

import { BasicDialog } from '/@/components/Dialog'
import BasicForm from '../BasicForm.vue'
import { ref, unref, render, createVNode, nextTick } from 'vue'
import { globalAppContext } from '/@/components/registerGlobalComp'
import { isFunction, merge } from 'lodash-es'

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
  const dialogRef = ref<BasicDialogActionType>()
  const formRef = ref<BasicFormActionType>()

  const isRendered = ref(false)

  // FormDialog FunctionalComponent
  const FormDialogRender = (props: Partial<FormDialogProps>, context: SetupContext) => {
    isRendered.value = true

    const dialogProps = {
      ...(props.dialogProps || {}),
      onConfirm: unref(formRef)?.submit,
      onVisibleChange: (visible: boolean) => {
        // 不可视时重置表单值
        !visible && unref(formRef)?.resetFields()
      },
    }

    // hook onSubmit
    function handleSubmit(res: Recordable) {
      context.emit('submit', res, unref(dialogRef)!, unref(formRef)!)

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
        <BasicForm ref={formRef} {...{ ...formProps }} v-slots={context.slots} />
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
    // 如果不在模板中使用则需要手动创建节点
    // 手动创建节点会在关闭Dialog时直接销毁DOM节点，避免无法销毁导致内存泄漏
    if (isRendered.value) return

    // vnode is created
    if (_fdInstance) return

    const container = document.createElement('div')

    // hack onClosed hook to gc this dom
    function onClosed() {
      nextTick(() => {
        render(null, container)
        document.body.removeChild(container)

        // reset
        isRendered.value = false
        _fdInstance = null
      })
    }

    const vnodeProps = merge(createProps, { dialogProps: { onClosed } })

    // vnode
    const vm = createVNode(FormDialogRender, vnodeProps)
    // useing App context
    vm.appContext = globalAppContext
    render(vm, container)
    document.body.appendChild(container)

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

  function getDialogAction() {
    return unref(dialogRef)
  }

  function getFormAction() {
    return unref(formRef)
  }

  // mouted action
  FormDialogRender.setDialogProps = setDialogProps
  FormDialogRender.setFormProps = setFormProps
  FormDialogRender.open = open
  FormDialogRender.close = close
  FormDialogRender.getDialogAction = getDialogAction
  FormDialogRender.getFormAction = getFormAction

  return FormDialogRender
}
