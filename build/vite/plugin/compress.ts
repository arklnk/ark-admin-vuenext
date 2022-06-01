import type { PluginOption } from 'vite'
import viteCompression from 'vite-plugin-compression'

export function configCompressionPlugin(
  compress: 'gzip' | 'brotli' | 'none',
  deleteOriginFile = false
): PluginOption | PluginOption[] {
  const compressSetting = compress.split(',')

  const plugins: PluginOption[] = []

  if (compressSetting.includes('gzip')) {
    plugins.push(
      viteCompression({
        ext: '.gz',
        deleteOriginFile,
        algorithm: 'gzip',
      })
    )
  }

  if (compressSetting.includes('brotli')) {
    plugins.push(
      viteCompression({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      })
    )
  }

  return plugins
}
