const farmRouter = require('./farm')
const filesRouter = require('./files')
const siteRouter = require('./site')
const userRouter = require('./user')

module.exports = {
  init: app => {
    app.use('/farm', farmRouter)
    app.use('/files', filesRouter)
    app.use('/site', siteRouter)
    app.use('/user', userRouter)
  }
}
