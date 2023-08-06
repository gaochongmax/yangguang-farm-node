const path = require('path')
const fs = require('fs')
const fsp = require('node:fs/promises')
const { Router } = require('express')
const { Types } = require('mongoose')
const { RES_EXCEPTION, UPLOAD_CONFIG, TEMP_DIR, FILES_DIR } = require('../config/constant')
const { resNormal, resAnormal, resFail } = require('../utils')
const { parseForm, move } = require('../middleware/file')
const checkLogin = require('../middleware/check-login')
const File = require('../models/file')

const router = Router()
const tempDir = path.resolve(TEMP_DIR)
const filesDir = path.resolve(FILES_DIR)

router.post('/upload-file', async (req, res, next) => {
  try {
    const { fields: { hash }, files: { file } } = await parseForm(req)
    // 如果已有该文件，直接返回文件信息，实现秒传
    const find = await File.findOne({ hash })
    if (find) {
      fsp.unlink(file.filepath)
      return resNormal(res, find)
    }
    const targetPath = path.join(filesDir, file.newFilename)
    await move(file.filepath, targetPath)
    const newFile = new File({
      name: file.newFilename,
      hash,
      size: file.size,
      type: file.mimetype,
      url: `${process.env.STATIC_URL}/${file.newFilename}`
    })
    await newFile.save()
    resNormal(res, newFile)
  } catch (e) {
    console.log(e)
    next(e)
  }
})

router.post('/upload-chunk', async (req, res, next) => {
  try {
    const { fields, files: { chunk } } = await parseForm(req)
    const chunkDir = path.join(tempDir, fields.hash)
    const targetPath = path.join(chunkDir, fields.index)
    try {
      await move(chunk.filepath, targetPath)
      resNormal(res, null)
    } catch (e) {
      if (e.code === 'ENOENT') {
        await fsp.mkdir(chunkDir)
        await move(chunk.filepath, targetPath)
        resNormal(res, null)
      }
    }
  } catch (e) {
    next(e)
  }
})

router.post('/joint-chunks', async (req, res, next) => {
  try {
    const { hash, name, type, size } = req.body
    const find = await File.findOne({ hash })
    if (find) {
      return resNormal(res, find)
    }
    const newFileName = `${Date.now()}-${name}`
    const chunkDir = path.join(tempDir, hash)
    const targetPath = path.join(filesDir, newFileName)
    const writeStream = fs.createWriteStream(targetPath)
    const names = await fsp.readdir(chunkDir)
    names.forEach((name, index) => {
      const chunkPath = path.resolve(chunkDir, name)
      const chunk = fs.readFileSync(chunkPath)
      writeStream.write(chunk)
      fsp.unlink(chunkPath)
      if (index >= names.length - 1) {
        writeStream.close()
      }
    })
    writeStream.on('close', async () => {
      fsp.rmdir(chunkDir, { maxRetries: 5, retryDelay: 300 })
      const newFile = new File({
        name: newFileName,
        hash,
        size,
        type,
        url: `${process.env.STATIC_URL}/${newFileName}`
      })
      await newFile.save()
      resNormal(res, newFile)
    })
    writeStream.on('error', e => {
      next(e)
    })
  } catch (e) {
    next(e)
  }
})

router.post('/get-uploaded-chunks', async (req, res) => {
  try {
    const { hash } = req.body
    const find = await File.findOne({ hash })
    if (find) {
      return resNormal(res, find)
    }
    const chunkDir = path.join(tempDir, hash)
    const names = await fsp.readdir(chunkDir)
    resNormal(res, names)
  } catch {
    resNormal(res, [])
  }
})

router.post('/delete', checkLogin(true), async (req, res, next) => {})

module.exports = router