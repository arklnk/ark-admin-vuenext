declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare type EmitFn = (event: string, ...args: any[]) => void

declare type LabelValueOptions = {
  label: string
  value: any
  [key: string]: string | number | boolean
}[]
