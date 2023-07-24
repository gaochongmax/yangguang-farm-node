const userRouter = require('./user')
const filesRouter = require('./files')
const farmRouter = require('./farm')

module.exports = {
  init: app => {
    app.use('/user', userRouter)
    app.use('/files', filesRouter)
    app.use('/farm', farmRouter)
  }
}
