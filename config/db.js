const mongoose = require('mongoose')
const consola = require('consola')

const { ENV, DB_USER, DB_PWD, DB_HOST, DB_PORT, DB_NAME, DB_BUCKET } = process.env
const dbAuthInfo = ENV === 'DEV' ? '' : `${DB_USER}:${DB_PWD}@`
const config = {
  url: `mongodb://${dbAuthInfo}${DB_HOST}:${DB_PORT}`,
  db_name: DB_NAME,
  bucket_name: DB_BUCKET
}

mongoose.Promise = global.Promise

mongoose.connection.once('open', () => {
  consola.ready('数据库连接成功!')
})
mongoose.connection.on('error', error => {
  consola.warn('数据库连接失败:', error)
})

let connection
const connect = () => {
  if (connection) {
    return connection
  }
  connection = mongoose.connect(`${config.url}/${DB_NAME}`, {
    useNewUrlParser: true,
  })
  return connection
}

module.exports = {
  config,
  mongoose,
  connect
}
