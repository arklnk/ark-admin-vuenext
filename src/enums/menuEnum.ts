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
 * iFrame类型菜单所需前缀 例如需要内嵌百度页面，则菜单路由地址为 iframeSrc:https://www.baidu.com
 */
export const IframePrefix = 'iframeSrc:'

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
