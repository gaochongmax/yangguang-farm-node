const { Router } = require('express')
const router = Router()

router.get('/list', function(req, res, next) {
  res.send('farm-list')
})

module.exports = router
