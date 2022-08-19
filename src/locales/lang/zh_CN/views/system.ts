export default {
  menu: {
    parent: '父级菜单',
    name: '菜单名称',
    type: '类型',
    icon: '图标',
    isShow: '状态',
    router: '路由',
    viewPath: '视图路径',
    perm: '权限',
    orderNum: '排序',

    // menu type
    menuTypeCatalogue: '目录',
    menuTypeMenu: '菜单',
    menuTypePermission: '权限',

    // show state
    menuHidden: '隐藏',

    editform: {
      title: '编辑菜单',
    },
  },

  role: {
    name: '角色名称',
    uniqueKey: '唯一标识',

    editform: {
      title: '编辑角色',
      parent: '父级角色',
      permissionAssign: '权限分配',
    },
  },

  dept: {
    name: '部门名称',
    fullname: '部门全称',
    code: '部门代码',
    type: '部门类型',

    deptTypeCompany: '公司',
    deptTypeSubsidiary: '子公司',
    deptTypeDepartment: '部门',

    editform: {
      title: '编辑部门',
      parent: '父级部门',
    },
  },

  job: {
    name: '岗位名称',

    editform: {
      title: '编辑岗位',
    },
  },
}
