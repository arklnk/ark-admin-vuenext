import { useI18n as useVueI18n } from 'vue-i18n'

/**
 * https://vue-i18n.intlify.dev/api/injection.html#t-key
 */
type I18nGlobalTranslation = {
  (key: string): string
  (key: string, locale: string): string
  (key: string, locale: string, list: unknown[]): string
  (key: string, locale: string, named: Record<string, unknown>): string
  (key: string, list: unknown[]): string
  (key: string, named: Record<string, unknown>): string
}

function getKey(namespace: string | undefined, key: string) {
  if (!namespace) return key
  if (key.startsWith(namespace)) return key

  return `${namespace}.${key}`
}

// useI18n in vue-i18n, prevent to nuptial rename to useTransl
export function useTransl(namespace?: string) {
  const { t } = useVueI18n()

  const tFn: I18nGlobalTranslation = (key: string, ...args: any[]) => {
    if (!key) return ''
    if (!key.includes('.') && !namespace) return key

    return t(getKey(namespace, key), ...(args as [string, any]))
  }

  return {
    t: tFn,
  }
}

// cooperate with vscode i18nn ally plugin, only using in define routes meta title
export const t = (key: string) => key
