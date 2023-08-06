const { Router } = require('express')
const router = Router()
const { Types } = require('mongoose')
const User = require('../models/user')
const Secret = require('../models/secret')
const {
  resNormal,
  resAnormal,
  decrypt,
} = require('../utils')
const { RES_EXCEPTION, ROLES } = require('../config/constant')
const checkLogin = require('../middleware/check-login')

// 注册
router.post('/register', async (req, res, next) => {
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

// 退出登录
router.post('/logout', (req, res) => {
  const id = req.session && req.session.userId
  if (id) {
    req.session.userId = undefined
  }
  resNormal(res, null)
})

// 获取个人信息
router.post('/profile', checkLogin(true), (req, res) => {
  resNormal(res, req.user)
})

// 保存个人信息
router.post('/save', checkLogin(true), async (req, res) => {
  try {
    await User.findByIdAndUpdate(Types.ObjectId(req.session.userId), req.body)
    resNormal(res, null)
  } catch (e) {
    resAnormal(res)
  }
})

// 切换身份
router.post('/switch-role', checkLogin(true), async (req, res) => {
  try {
    const { role } = req.user
    if (role === ROLES.none) {
      return resNormal(res, null)
    }
    const modify = { role: role === ROLES.farmer ? ROLES.seller : ROLES.farmer }
    await User.findByIdAndUpdate(Types.ObjectId(req.session.userId), modify)
    resNormal(res, null)
  } catch (e) {
    resAnormal(res)
  }
})

module.exports = router
