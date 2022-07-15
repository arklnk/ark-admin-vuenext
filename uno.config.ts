import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  exclude: ['node_modules', '.git', '.vscode', 'dist', 'public', 'build', 'mock'],
  presets: [
    presetUno({
      dark: 'class',
    }),
  ],
  shortcuts: {},
})
