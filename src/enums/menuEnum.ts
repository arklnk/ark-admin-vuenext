/**
 * 菜单类型
 */
export enum MenuTypeEnum {
  /**
   * 目录
   */
  Catalogue = 0,

  /**
   * 菜单
   */
  Menu = 1,

  /**
   * 权限
   */
  Permission = 2,
}

/**
 * 菜单模式
 */
export enum MenuModeEnum {
  /**
   * 侧边栏模式
   */
  SIDEBAR = 'sidebar',

  /**
   * 顶部菜单模式
   */
  TOP_MENU = 'top_menu',
}

/**
 * 折叠菜单触发器位置
 */
export enum MenuTriggerEnum {
  /**
   * 不显示
   */
  NONE = 'none',

  /**
   * 底部
   */
  BOTTOM = 'bottom',

  /**
   * 顶部
   */
  TOP = 'top',
}
