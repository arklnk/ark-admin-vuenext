import { createStorage } from './storage'
import { prefixCls } from '/@/settings/designSetting'

export const WebStorage = createStorage({ storage: localStorage, prefixKey: `${prefixCls}` })

export default WebStorage
