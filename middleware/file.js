const fs = require('fs')
const fsp = require('node:fs/promises')
const path = require('path')
const formidable = require('formidable')
const { TEMP_DIR, FILES_DIR } = require('../config/constant')

const tempDir = path.resolve(TEMP_DIR)
const filesDir = path.resolve(FILES_DIR)

  ; (async () => {
    try {
      await fsp.access(tempDir)
      await fsp.access(filesDir)
    } catch (e) {
      fsp.mkdir(tempDir)
      fsp.mkdir(filesDir)
    }
  })()

const defaultOptions = {
  keepExtensions: true,
  uploadDir: tempDir,
  maxFileSize: 200 * 1024 * 1024
}

const parseForm = (req, options = defaultOptions) => new Promise(
  (resolve, reject) => {
    const form = new formidable.IncomingForm(options)
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve({ fields, files })
    })
  }
)

const move = (sourcePath, targetPath) => new Promise((resolve, reject) => {
  try {
    fsp.rename(sourcePath, targetPath).then(resolve, reject)
  } catch {
    const readStream = fs.createReadStream(sourcePath)
    const writeStream = fs.createWriteStream(targetPath)
    readStream.on('error', err => {
      writeStream.close()
      reject(err)
    })
    readStream.on('end', () => {
      fsp.unlink(sourcePath)
      resolve()
    })
    writeStream.on('error', err => reject(err))
    readStream.pipe(writeStream)
  }
})

module.exports = {
  parseForm,
  move,
}