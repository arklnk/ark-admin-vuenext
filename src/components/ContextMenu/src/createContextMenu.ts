import type { ContextMenuProps, CreateContextMenuOptions } from './typing'

import { createVNode, render } from 'vue'
import ContextMenuVue from './ContextMenu.vue'

const contextMenuManager: { domList: Element[]; resolve: Fn } = {
  domList: [],
  resolve: () => {},
}

export function createContextMenu(opt: CreateContextMenuOptions) {
  const { event } = opt || {}

  event && event.preventDefault()

  return new Promise((resove) => {
    const body = document.body

    const container = document.createElement('div')
    container.setAttribute('class', 'context-menu-container')

    const propsData: Partial<ContextMenuProps> = {}
    if (opt.width) {
      propsData.width = opt.width
    }

    if (opt.style) {
      propsData.customStyle = opt.style
    }

    if (opt.items) {
      propsData.items = opt.items
    }

    if (event) {
      propsData.customEvent = event
      propsData.axis = { x: event.clientX, y: event.clientY }
    }

    const vm = createVNode(ContextMenuVue, propsData)
    // https://github.com/element-plus/element-plus/blob/dev/packages/components/message-box/src/messageBox.ts#L41
    vm.appContext = ContextMenuVue._context

    render(vm, container)

    const handleClick = function () {
      contextMenuManager.resolve('')
    }

    const remove = function () {
      contextMenuManager.domList.forEach((dom) => {
        try {
          body.removeChild(dom)
        } catch (e) {}
      })

      body.removeEventListener('click', handleClick)
      body.removeEventListener('scroll', handleClick)
    }

    contextMenuManager.domList.push(container)
    contextMenuManager.resolve = function (arg) {
      remove()
      resove(arg)
    }

    // remove pre
    remove()

    body.appendChild(container)
    body.addEventListener('click', handleClick)
    body.addEventListener('scroll', handleClick)
  })
}

export function destoryContextMenu() {
  if (contextMenuManager) {
    contextMenuManager.resolve('')
    contextMenuManager.domList = []
  }
}
