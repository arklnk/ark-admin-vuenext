import type { ButtonProps, PopconfirmProps } from '/@/components/Button'
import { RoleEnum } from '/@/enums/roleEnum'

export interface TableActionItem extends ButtonProps {
  onClick?: Fn
  label?: string
  permission?: RoleEnum | RoleEnum[] | string | string[]
  divider?: boolean
  hidden?: boolean | ((item: TableActionItem) => boolean)
  popconfirm?: PopconfirmProps
}
