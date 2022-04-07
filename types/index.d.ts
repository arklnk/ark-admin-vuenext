declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare type LabelValueOptions = {
  label: string
  value: any
  [key: string]: string | number | boolean
}[]
