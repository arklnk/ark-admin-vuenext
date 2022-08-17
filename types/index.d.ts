declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

declare type EmitFn = (event: any, ...args: any[]) => void

declare type WindowTargetContext = '_self' | '_blank'

declare type LabelValueOptions = {
  label: string
  value: any
  [key: string]: string | number | boolean
}[]

declare interface ComponentEl<T extends HTMLElement = HTMLDivElement> {
  $el?: T
}
