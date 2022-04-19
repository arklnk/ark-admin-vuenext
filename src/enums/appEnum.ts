// refer to Bootstrap's responsive design
export const MOBILE_WIDTH = 768

//  Route switching animation
export enum RouterTransitionEnum {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}

export enum ContentEnum {
  FULL = 'full',
  FIXED = 'fixed',
}

export const contentMap: Map<ContentEnum, string> = (() => {
  const map = new Map<ContentEnum, string>()
  map.set(ContentEnum.FULL, '流式')
  map.set(ContentEnum.FIXED, '定宽')
  return map
})()
