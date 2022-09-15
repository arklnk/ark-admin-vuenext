import type { BasicFormActionType, BasicFormProps } from '../typing'
import type { BasicDrawerActionType, BasicDrawerProps } from '/@/components/Drawer'
import type { SetupContext, ComponentInternalInstance } from 'vue'

import { BasicDrawer } from '/@/components/Drawer'
import BasicForm from '../BasicForm.vue'
import { ref, unref, nextTick, render, createVNode } from 'vue'
import { isFunction, merge } from 'lodash-es'
import { globalAppContext } from '/@/components/registerGlobalComp'
import { tryOnUnmounted } from '@vueuse/core'

interface FormDrawerProps {
  formProps: BasicFormProps
  drawerProps: BasicDrawerProps
  handleSubmit: (
    res: Recordable,
    drawerAction: BasicDrawerActionType,
    formAction: BasicFormActionType
  ) => void | Promise<void>
}

type OnOpenFn = (
  drawerAction: BasicDrawerActionType,
  formAction: BasicFormActionType
) => void | Promise<void>

export function createFormDrawer(createProps: Partial<FormDrawerProps>) {
  const drawerRef = ref<Nullable<BasicDrawerActionType>>()
  const formRef = ref<Nullable<BasicFormActionType>>()

  tryOnUnmounted(() => {
    drawerRef.value = null
    formRef.value = null
  })

  const FormDrawerRender = (props: Partial<FormDrawerProps>, context: SetupContext) => {
    const drawerProps = {
      ...(props.drawerProps || {}),
      destroyOnClose: true,
      onConfirm: unref(formRef)?.submit,
      onCancel: () => {
        // 不可视时重置表单值
        unref(formRef)?.resetFields()
      },
    }

    // hook onSubmit
    function handleSubmit(res: Recordable) {
      if (props.handleSubmit && isFunction(props.handleSubmit)) {
        props.handleSubmit(res, unref(drawerRef)!, unref(formRef)!)
      }
    }

    const formProps = {
      ...(props.formProps || {}),
      showActionButtonGroup: false,
      onSubmit: handleSubmit,
    }

    return (
      <BasicDrawer ref={drawerRef} {...drawerProps}>
        <BasicForm ref={formRef} {...formProps} v-slots={context.slots} />
      </BasicDrawer>
    )
  }

  // normalized to camelCase unless the props option is specified.
  FormDrawerRender.props = ['drawerProps', 'formProps', 'handleSubmit']
  FormDrawerRender.emits = ['submit']

  // init vnode without template
  let _fdInstance: ComponentInternalInstance | null

  function initVNode() {
    // 在模板中使用，那么无需手动初始化，直接操作使用FormDrawerRender操作即可
    // 但请注意使用时机，必须保证在mounted后操作
    // 如果不在模板中使用则需要手动创建节点
    // 手动创建节点会在关闭Drawer时直接销毁DOM节点，避免无法销毁导致内存泄漏
    if (unref(drawerRef)) return

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

    const vnodeProps = merge(createProps, { drawerProps: { onClosed } })

    // vnode
    const vm = createVNode(FormDrawerRender, vnodeProps)
    // useing App context
    vm.appContext = globalAppContext
    render(vm, container)
    document.body.appendChild(container.firstElementChild!)

    // created done
    _fdInstance = vm.component!
  }

  function setDrawerProps(props: BasicDrawerProps) {
    initVNode()

    unref(drawerRef)?.setProps(props)
  }

  function setFormProps(props: BasicFormProps) {
    initVNode()

    unref(formRef)?.setProps(props)
  }

  function open(onOpen?: OnOpenFn) {
    setDrawerProps({ visible: true })

    if (isFunction(onOpen)) {
      nextTick(() => {
        onOpen(unref(drawerRef)!, unref(formRef)!)
      })
    }
  }

  function close() {
    setDrawerProps({ visible: false })
  }

  // mouted action
  FormDrawerRender.setDrawerProps = setDrawerProps
  FormDrawerRender.setFormProps = setFormProps
  FormDrawerRender.open = open
  FormDrawerRender.close = close

  return FormDrawerRender
}
