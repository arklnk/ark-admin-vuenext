export interface Axis {
  x: number
  y: number
}

export interface ContextMenuItem {
  label?: string
  icon?: string | VueNode
  hidden?: boolean
  disabled?: boolean
  divider?: boolean
  handler?: Fn
}

export interface CreateContextMenuOptions {
  event: MouseEvent
  items?: ContextMenuItem
}
