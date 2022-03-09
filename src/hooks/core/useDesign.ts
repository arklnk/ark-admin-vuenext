/**
 * https://github.com/element-plus/element-plus/blob/dev/packages/hooks/use-prefixCls/index.ts
 */
import { useAppProviderContext } from '/@/components/Application/src/useAppContext'

const statePrefix = 'is-'

function _bem(
  prefixCls: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) {
  let cls = `${prefixCls}-${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

export function useDesign(block: string) {
  const { prefixCls } = useAppProviderContext()

  const b = (blockSuffix = '') => _bem(prefixCls, block, blockSuffix, '', '')
  const e = (element?: string) => (element ? _bem(prefixCls, block, '', element, '') : '')
  const m = (modifier?: string) => (modifier ? _bem(prefixCls, block, '', '', modifier) : '')
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element ? _bem(prefixCls, block, blockSuffix, element, '') : ''
  const em = (element?: string, modifier?: string) =>
    element && modifier ? _bem(prefixCls, block, '', element, modifier) : ''
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier ? _bem(prefixCls, block, blockSuffix, '', modifier) : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier ? _bem(prefixCls, block, blockSuffix, element, modifier) : ''
  const is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true
    return name && state ? `${statePrefix}${name}` : ''
  }

  return {
    prefixCls,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
  }
}
