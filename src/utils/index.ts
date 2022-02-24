import { isEmpty } from 'lodash-es'

const defaultTitle = import.meta.env.VITE_APP_TITLE

export function getPageTitle(subTitle: string | undefined | null) {
  if (isEmpty(subTitle)) {
    return defaultTitle
  }
  return `${subTitle} - ${defaultTitle}`
}
