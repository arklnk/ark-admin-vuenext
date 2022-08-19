import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
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
  presets: [
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
})
