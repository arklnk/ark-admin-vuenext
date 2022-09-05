import type CryptoJS from 'crypto-js'

import { MD5, enc, mode, AES, pad } from 'crypto-js'

export function createAESCipherOptions(iv?: string) {
  let wordIv: CryptoJS.lib.WordArray | undefined
  if (iv) {
    wordIv = enc.Utf8.parse(iv)
  }
  return {
    iv: wordIv,
    mode: mode.CFB,
    padding: pad.AnsiX923,
  }
}

export function encryptByAES(text: string, key: string, options?: Recordable) {
  return AES.encrypt(text, key, options).toString()
}

export function decryptByAES(text: string, key: string, options?: Recordable) {
  return AES.decrypt(text, key, options).toString(enc.Utf8)
}

export function encryptByMD5(text: string) {
  return MD5(text).toString()
}

export function encodeByBase64(text: string) {
  return enc.Utf8.parse(text).toString(enc.Base64)
}

export function decodeByBase64(decode: string) {
  return enc.Base64.parse(decode).toString()
}
