const { Router } = require('express')
const router = Router()
const checkLogin = require('../middleware/check-login')
const { resNormal } = require('../utils')

router.post('/check-login', checkLogin(), (req, res) => {
  resNormal(res, Boolean(req.user))
})

module.exports = router
