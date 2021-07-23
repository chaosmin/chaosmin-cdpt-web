import CryptoJS from 'crypto-js'

function getAesString(data, key, iv) {
  const keyUtf8 = CryptoJS.enc.Hex.parse(key)
  const ivUtf8 = CryptoJS.enc.Hex.parse(iv)
  const encrypted = CryptoJS.AES.encrypt(data, keyUtf8, {
    iv: ivUtf8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString()
}

export function getDAes(data) {
  const key = '46556a7340313736353448474a4b4b6e'
  const iv = '48477479263625346f6a795579686779'
  return getAesString(data, key, iv)
}
