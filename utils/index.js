const { HTTP_CODE, RES_NORMAL_CODE, RES_EXCEPTION } = require('../config/constant')
const { encrypt, decrypt } = require('./security')

module.exports = {
  encrypt,
  decrypt,
  // 请求成功，结果正常
  resNormal: (res, data = null, statusCode = HTTP_CODE.success) => {
    res.status(statusCode).send({ code: RES_NORMAL_CODE, data })
  },
  // 请求成功，结果异常
  resAnormal: (res, exception = RES_EXCEPTION.other, data, statusCode = HTTP_CODE.success) => {
    const { code, message } = exception
    res.status(statusCode).send({ code, message, data })
  },
  // 请求失败
  resFail: (res, message = RES_EXCEPTION.other.message, statusCode = HTTP_CODE.fail) => {
    res.status(statusCode).send({ message })
  },
}