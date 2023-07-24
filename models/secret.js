const { mongoose } = require('../config/db')

const secretSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  password: { type: String, required: true },
})

module.exports = mongoose.model('Secret', secretSchema)
