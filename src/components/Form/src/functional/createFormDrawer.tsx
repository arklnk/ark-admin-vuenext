import type { BasicFormActionType, BasicFormProps } from '../typing'
import type { BasicDrawerProps, BasicDrawerActionType } from '/@/components/Drawer'
import type { ComponentInternalInstance } from 'vue'

import { BasicDrawer } from '/@/components/Drawer'
import BasicForm from '../BasicForm.vue'
import { ref, unref, render, createVNode, nextTick, getCurrentInstance, onUnmounted } from 'vue'
import { globalAppContext } from '/@/components/registerGlobalComp'
import { isFunction, merge } from 'lodash-es'

type OnSubmitFn = (res: Recordable, ist: FormDrawerInstance) => void | Promise<void>

type OnOpenFn = (ist: FormDrawerInstance) => void | Promise<void>

interface FormDrawerProps {
  formProps: BasicFormProps
  drawerProps: BasicDrawerProps
  submit: OnSubmitFn
}

interface FormDrawerInstance {
  open: (fn?: OnOpenFn) => void | Promise<void>
  close: () => void
  showLoading: () => void
  hideLoading: () => void
  getDrawerAction: () => Nullable<BasicDrawerActionType>
  getFormAction: () => Nullable<BasicFormActionType>
}

export function createFormDrawer(createProps?: Partial<FormDrawerProps>): FormDrawerInstance {
  const drawerRef = ref<Nullable<BasicDrawerActionType>>(null)
  const formRef = ref<Nullable<BasicFormActionType>>(null)

  // 判断是否在setup中调用，用于判断是否能在生命周期中释放资源
  const isRunInSetup = !!getCurrentInstance()

  // FormDrawer FunctionalComponent
  const FormDrawerRender = (props: Partial<FormDrawerProps>) => {
    const drawerProps = {
      destroyOnClose: true,
      ...(props.drawerProps || {}),
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
      <BasicDrawer ref={drawerRef} {...drawerProps}>
        <BasicForm ref={formRef} {...formProps} />
      </BasicDrawer>
    )
  }

  // normalized to camelCase unless the props option is specified.
  FormDrawerRender.props = ['drawerProps', 'formProps', 'submit']

  const container = document.createElement('div')
  let _componentInstance: ComponentInternalInstance | null = null

  function release() {
    // here we were suppose to call document.body.removeChild(container.firstElementChild)
    // but render(null, container) did that job for us. so that we do not call that directly
    render(null, container)

    drawerRef.value = null
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

    createProps = merge(createProps, { drawerProps: { onClosed } })
  } else {
    onUnmounted(() => {
      release()
    })
  }

  // lazy init
  function initVNode() {
    // inited return
    if (_componentInstance) return

    const vm = createVNode(FormDrawerRender, createProps)
    vm.appContext = globalAppContext

    render(vm, container)
    document.body.appendChild(container.firstElementChild!)

    _componentInstance = vm.component!
  }

  function getDrawerAction() {
    initVNode()

    return unref(drawerRef)
  }

  function getFormAction() {
    initVNode()

    return unref(formRef)
  }

  // expose operate function
  function open(onOpen?: OnOpenFn) {
    getDrawerAction()?.setProps({ visible: true })

    if (onOpen && isFunction(onOpen)) {
      nextTick(() => {
        onOpen(action)
      })
    }
  }

  function close() {
    getDrawerAction()?.setProps({ visible: false })
  }

  function showLoading() {
    getDrawerAction()?.setProps({ loading: true, confirmBtnProps: { loading: true } })
  }

  function hideLoading() {
    getDrawerAction()?.setProps({ loading: false, confirmBtnProps: { loading: false } })
  }

  const action: FormDrawerInstance = {
    getDrawerAction,
    getFormAction,
    open,
    close,
    showLoading,
    hideLoading,
  }

  return action
}
