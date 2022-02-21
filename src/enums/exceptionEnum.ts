/**
 * @description Exception related enumeration
 */
export enum ExceptionEnum {
  /**
   * @description server error
   */
  ERROR = 500,

  /**
   * @description token error related
   */
  TOKEN_INVALID = 11001,
  TOKEN_EXPIRE = 11002,

  /**
   * @description permission error related
   */
  PERMISSION_FORBIDDEN = 11003
}
