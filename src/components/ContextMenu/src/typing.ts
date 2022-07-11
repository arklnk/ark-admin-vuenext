import type { CSSProperties, Component } from 'vue'

export interface Axis {
  x: number
  y: number
}

export interface ContextMenuItem {
  label?: string
  icon?: string | Component
  hidden?: boolean
  disabled?: boolean
  divider?: boolean
  handler?: Fn
  children?: ContextMenuItem[]
}

export interface ContextMenuProps {
  width?: number
  showIcon?: boolean
  customStyle?: CSSProperties
  customEvent?: MouseEvent
  axis?: Axis
  items?: ContextMenuItem[]
}

export interface CreateContextMenuOptions {
  event: MouseEvent
  style?: CSSProperties
  items?: ContextMenuItem[]
  showIcon?: boolean
  width?: number
}

export interface ItemContentProps {
  showIcon: boolean | undefined
  item: ContextMenuItem
  handler: Fn
}
