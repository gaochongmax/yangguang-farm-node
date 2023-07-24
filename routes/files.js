const { Router } = require('express')
const router = Router()
const { Types } = require('mongoose')
const { RES_EXCEPTION, UPLOAD_CONFIG } = require('../config/constant')
const { resNormal, resAnormal, resFail } = require('../utils')
const { getBucket, download, remove, upload } = require('../middleware/file')
const checkLogin = require('../middleware/check-login')

router.get('/:name', download)

router.post('/delete', checkLogin(true), async (user, req, res, next) => {
  try {
    const bucket = await getBucket()
    const files = await bucket.find({ _id: Types.ObjectId(req.body.file_id) }).toArray()
    if (!files[0]) {
      return resNormal(res, true)
    }
    if (files[0].metadata && files[0].metadata.uploader !== user._id.toString()) {
      return resAnormal(res, RES_EXCEPTION.no_permission)
    }
    await remove(req, res)
  } catch (e) {
    resFail(res, '文件删除失败')
  }
})

router.post('/upload-img', checkLogin(true), upload(UPLOAD_CONFIG.img))

router.post('/upload-video', checkLogin(true), upload(UPLOAD_CONFIG.video))

module.exports = router