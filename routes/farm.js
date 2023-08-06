const { Router } = require('express')
const router = Router()

router.get('/list', (req, res, next) => {
  res.send('farm-list')
})

module.exports = router
