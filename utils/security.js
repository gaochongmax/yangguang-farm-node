const CryptoJS = require('crypto-js')

const SECRET_KEY = 'yangguangfarm'

/**
 * @description aes加密
 * @param {string} word 需要加密的字符串
 */
const encrypt = word => CryptoJS.AES.encrypt(word, SECRET_KEY).toString()

/**
 * @description aes解密
 * @param {string} ciphertext 需要解密的字符串
 */
const decrypt = ciphertext => CryptoJS.AES.decrypt(ciphertext, SECRET_KEY).toString(CryptoJS.enc.Utf8)

module.exports = {
  encrypt,
  decrypt
}