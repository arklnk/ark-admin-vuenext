import { RoleEnum } from '/@/enums/roleEnum'

export interface TableAction {
  onClick?: Fn
  auth?: RoleEnum | RoleEnum[] | string | string[]
}
