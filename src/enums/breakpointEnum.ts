export enum SizeEnum {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
  XXL = 'XXL',
}

export enum ScreenEnum {
  XS = 480,
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1600,
}

const screenMap = new Map<SizeEnum, number>()

screenMap.set(SizeEnum.XS, ScreenEnum.XS)
screenMap.set(SizeEnum.SM, ScreenEnum.SM)
screenMap.set(SizeEnum.MD, ScreenEnum.MD)
screenMap.set(SizeEnum.LG, ScreenEnum.LG)
screenMap.set(SizeEnum.XL, ScreenEnum.XL)
screenMap.set(SizeEnum.XXL, ScreenEnum.XXL)

export { screenMap }
