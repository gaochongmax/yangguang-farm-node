const util = require('util')
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const { MongoClient, GridFSBucket } = require('mongodb')
const { Types } = require('mongoose')
const { resNormal, resAnormal, resFail } = require('../utils/index')
const { HTTP_CODE, RES_EXCEPTION } = require('../config/constant')
const db = require('../config/db')

// 获取、删除-------------------------------------------
let bucket
const getBucket = async () => {
  if (bucket) {
    return bucket
  }
  const mongoClient = new MongoClient(db.config.url)
  await mongoClient.connect()
  const database = mongoClient.db(db.config.db_name)
  bucket = new GridFSBucket(database, {
    bucketName: db.config.bucket_name,
  })
  return bucket
}

// 获取
const download = async (req, res) => {
  try {
    const bucket = await getBucket()
    const downloadStream = bucket.openDownloadStreamByName(req.params.name)
    downloadStream.on('data', data => res.status(HTTP_CODE.success).write(data))
    downloadStream.on('error', err => res.status(HTTP_CODE.not_found).send({ message: '文件获取失败' }))
    downloadStream.on('end', () => res.end())
  } catch (e) {
    resFail(res, '文件获取失败')
  }
}

// 删除
const remove = async (req, res) => {
  try {
    const bucket = await getBucket()
    bucket.delete(Types.ObjectId(req.body.file_id))
    resNormal(res, true)
  } catch (e) {
    resFail(res, '文件删除失败')
  }
}

// 上传-------------------------------------------
const storage = new GridFsStorage({
  db: db.connect(),
  file: (req, file) => {
    const id = req.session && req.session.userId
    return {
      metadata: { uploader: id },
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: db.config.bucket_name,
    }
  }
})

const multerConfiger = (config) => {
  const upload = multer({
    storage,
    limits: { fileSize: config.file_size },
    fileFilter: (req, file, cb) => {
      if (!config.mime_types.includes(file.mimetype)) {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname))
      }
      cb(null, true)
    }
  }).single('file')
  return util.promisify(upload)
}

const upload = config => async (user, req, res, next) => {
  try {
    const middleware = multerConfiger(config)
    await middleware(req, res)
    if (!req.file)  {
      return resAnormal(res, RES_EXCEPTION.no_file)
    }
    resNormal(res, {
      file_id: req.file.id.toString(),
      file_url: `${process.env.STATIC_URL}/${req.file.filename}`
    })
  } catch (e) {
    if (e.code === 'LIMIT_UNEXPECTED_FILE') {
      return resAnormal(res, RES_EXCEPTION.unexpected_file)
    }
    if (e.code === 'LIMIT_FILE_SIZE') {
      return resAnormal(res, RES_EXCEPTION.limit_file_size)
    }
    return resFail(res, '文件上传失败')
  }
}

module.exports = {
  getBucket,
  download,
  remove,
  upload
}