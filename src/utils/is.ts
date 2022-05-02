export const isServer = typeof window === 'undefined'

export function isUrl(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}
