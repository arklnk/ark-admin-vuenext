import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'

export function useMessage() {
  return {
    createNotification: ElNotification,
    createMessage: ElMessage,
    createMessageBox: ElMessageBox,
  }
}
