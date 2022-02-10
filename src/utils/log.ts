const projectName = import.meta.env.VITE_APP_TITLE

export function info(message: string) {
  console.info(`[${projectName} info]:${message}`)
}

export function warn(message: string) {
  console.warn(`[${projectName} warn]:${message}`)
}

export function error(message: string) {
  throw new Error(`[${projectName} error]:${message}`)
}
