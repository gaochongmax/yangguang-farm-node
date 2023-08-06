const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const createError = require('http-errors')
const db = require('./config/db')
const routes = require('./routes')
const { resFail } = require('./utils')
const { HTTP_CODE } = require('./config/constant')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'yangguang_farm',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
}))

// 连接数据库
db.connect()

// 注册路由
routes.init(app)

// 捕捉404，传递给全局错误处理中间件
app.use((req, res, next) => {
  next(createError(HTTP_CODE.not_found))
})

// 全局错误处理中间件
app.use((err, req, res, next) => {
  resFail(res, err.message, err.status)
})

module.exports = app
