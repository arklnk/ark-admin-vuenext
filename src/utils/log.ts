import { isProdMode } from './env'

export function info(message: string) {
  if (isProdMode()) return
  console.info(`[info]: ${message}`)
}

export function warn(message: string) {
  if (isProdMode()) return
  console.warn(`[warn]: ${message}`)
}

export function error(message: string) {
  throw new Error(`[error]: ${message}`)
}
