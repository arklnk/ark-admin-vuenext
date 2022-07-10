export enum SizeEnum {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
}

export enum ScreenEnum {
  XS = 480,
  SM = 768,
  MD = 992,
  LG = 1200,
  XL = 1920,
}

const screenMap = new Map<SizeEnum, number>()

screenMap.set(SizeEnum.XS, ScreenEnum.XS)
screenMap.set(SizeEnum.SM, ScreenEnum.SM)
screenMap.set(SizeEnum.MD, ScreenEnum.MD)
screenMap.set(SizeEnum.LG, ScreenEnum.LG)
screenMap.set(SizeEnum.XL, ScreenEnum.XL)

export { screenMap }
