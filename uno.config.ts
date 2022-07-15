import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  exclude: ['node_modules', '.git', '.vscode', 'dist', 'public', 'build', 'mock'],
  presets: [
    presetUno({
      dark: 'class',
    }),
  ],
  shortcuts: {},
  theme: {
    colors: {
      primary: 'var(--el-color-primary)',
      success: 'var(--el-color-success)',
      warning: 'var(--el-color-warning)',
      danger: 'var(--el-color-danger)',
      error: 'var(--el-color-error)',
      overlay: 'var(--el-bg-color-overlay)',
      page: 'var(--el-bg-color-page)',
    },
  },
})
