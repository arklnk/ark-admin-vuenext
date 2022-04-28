import { IFrameLayout, ParentLayout } from '../../contants'
import { defineRoleModule } from '../../helper/defineModule'
import { RoleEnum } from '/@/enums/roleEnum'

export default defineRoleModule([
  {
    path: '/sys',
    name: 'sys',
    component: ParentLayout,
    children: [
      {
        path: '/sys/user',
        name: 'sysuser',
        component: () => import('/@/views/system/permission/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'user',
        },
      },
      {
        path: '/sys/menu',
        name: 'sysmenu',
        component: () => import('/@/views/system/permission/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'menu',
          roles: [RoleEnum.ROOT],
        },
      },
    ],
    meta: {
      title: '系统管理',
      icon: 'system',
    },
  },
  {
    path: '/docs',
    name: 'docs',
    component: ParentLayout,
    children: [
      {
        path: '/docs/typeorm',
        name: 'docstypeorm',
        component: IFrameLayout,
        meta: {
          title: 'TypeOrm文档(内嵌)',
          icon: 'docs',
          iframeSrc: 'https://www.bookstack.cn/read/TypeORM-0.2.20-zh/README.md',
        },
      },
    ],
  },
])
