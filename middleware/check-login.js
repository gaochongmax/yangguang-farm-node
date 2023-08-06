const { Types } = require('mongoose')
const { resAnormal } = require('../utils')
const { RES_EXCEPTION } = require('../config/constant')
const User = require('../models/user')

/**
 * 检查登录中间件
 * @param {*} intercept: Boolean 是否拦截响应
 * @returns middleware
 */
const checkLogin = intercept => async (req, res, next) => {
  const id = req.session && req.session.userId
  let user
  if (id) {
    try {
      user = await User.findOne({ _id: Types.ObjectId(id) })
    } catch (e) {
      console.log(e)
    }
  }
  req.user = user
  if (!intercept) {
    return next()
  }
  if (!id) {
    resAnormal(res, RES_EXCEPTION.not_login)
  } else if (!user) {
    req.session.userId = undefined
    resAnormal(res, RES_EXCEPTION.user_inexist)
  } else {
    next()
  }
}

module.exports = checkLogin