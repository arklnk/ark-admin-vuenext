import type { PluginOption } from 'vite'

import unocss from 'unocss/vite'
import { presetUno } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import iconData from '/@/components/Icon/data/icon.data'

export function configUnoPlugin(isBuild: boolean): PluginOption {
  const prefix = 'i-'

  // 白名单列表，用于动态设置菜单Icon防止未使用的icon导致不被打包
  function createSafeListByIcon(): string[] {
    return iconData.map((i) => `${prefix}${i}`)
  }

  return unocss({
    envMode: isBuild ? 'build' : 'dev',
    safelist: [...createSafeListByIcon()],
    presets: [
      // icon
      presetIcons({
        prefix,
        extraProperties: {
          display: 'inline-block',
          overflow: 'hidden',
          width: '1em',
          height: '1em',
          'vertical-align': '-0.15em',
        },
      }),

      // unocss
      presetUno({
        dark: 'class',
      }),
    ],
    shortcuts: {
      'bg-comp': 'bg-white dark:bg-overlay',
    },
    theme: {
      colors: {
        primary: 'var(--el-color-primary)',
        success: 'var(--el-color-success)',
        warning: 'var(--el-color-warning)',
        danger: 'var(--el-color-danger)',
        error: 'var(--el-color-error)',
        info: 'var(--el-color-info)',
        overlay: 'var(--el-bg-color-overlay)',
        page: 'var(--el-bg-color-page)',
        bd: 'var(--el-border-color)',
        disabled: 'var(--el-text-color-disabled)',
        regular: 'var(--el-text-color-regular)',
        placeholder: 'var(--el-text-color-placeholder)',
        primarytext: 'var(--el-text-color-primary)',
      },
    },
    exclude: [
      'node_modules',
      '.git',
      '.vscode',
      'dist',
      'public',
      'build',
      'mock',
      '.github',
      'types',
    ],
  })
}
