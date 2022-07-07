import { isProdMode } from './env'

const projectName = import.meta.env.VITE_APP_TITLE

export function info(message: string) {
  if (isProdMode()) return
  console.info(`[${projectName} info]: ${message}`)
}

export function warn(message: string) {
  if (isProdMode()) return
  console.warn(`[${projectName} warn]: ${message}`)
}

export function error(message: string) {
  console.error(`[${projectName} error]: ${message}`)
}
