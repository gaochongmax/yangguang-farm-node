const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const Secret = require('../models/secret')
const {
  resNormal,
  resAnormal,
  decrypt,
} = require('../utils/index')
const { RES_EXCEPTION } = require('../config/constant')
const checkLogin = require('../middleware/check-login')

// 注册
router.post('/register', async function(req, res, next) {
  try {
    const { mobile, password } = req.body
    const data = await User.findOne({ mobile })
    if (data) {
      return resAnormal(res, RES_EXCEPTION.registered)
    }
    const user = new User({ mobile })
    const { _id } = await user.save()
    const id = _id.toString()
    const secret = new Secret({
      user_id: id,
      password,
    })
    await secret.save()
    req.session.userId = id
    resNormal(res, { id })
  } catch {
    next()
  }
})

// 登录
router.post('/login', async (req, res, next) => {
  try {
    const { mobile, password } = req.body
    const user = await User.findOne({ mobile })
    if (!user) {
      return resAnormal(res, RES_EXCEPTION.user_inexist)
    }
    const id = user._id.toString()
    const secret = await Secret.findOne({ user_id: id })
    if (decrypt(password) === decrypt(secret.password)) {
      req.session.userId = id
      return resNormal(res, true)
    }
    resAnormal(res, RES_EXCEPTION.login_failed)
  } catch {
    next()
  }
})

// 获取个人信息
router.post('/profile', checkLogin(true), function(user, req, res, next) {
  resNormal(res, user)
})

module.exports = router
