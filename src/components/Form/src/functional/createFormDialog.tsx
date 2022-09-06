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

  // FormDialog FunctionalComponent
  const FormDialogRender = (props: Partial<FormDialogProps>, context: SetupContext) => {
    const dialogProps = {
      destroyOnClose: true,
      ...(props.dialogProps || {}),
      onConfirm: unref(formRef)?.submit,
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
  let _fdInstance: ComponentInternalInstance
  function initVNode() {
    // 不传参数时将默认为在模板中使用，那么无需手动初始化，直接操作使用FormDialogRender操作即可
    // 非模板使用会在关掉dialog时自动回收不会存在该dom节点
    // 可用于一些比较简单表单场景
    if (!createProps) return

    // is inited
    if (_fdInstance) return

    const container = document.createElement('div')

    // hack onClosed to gc
    function onClosed() {
      nextTick(() => {
        render(null, container)
        document.body.removeChild(container)
      })
    }
    const fdProps = merge(createProps, { dialogProps: { onClosed } })

    // vnode
    const vm = createVNode(FormDialogRender, fdProps)
    // useing App context
    vm.appContext = globalAppContext
    render(vm, container)
    document.body.appendChild(container)

    // init done
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

  return [FormDialogRender, dialogRef, formRef] as [
    typeof FormDialogRender,
    typeof dialogRef,
    typeof formRef
  ]
}
