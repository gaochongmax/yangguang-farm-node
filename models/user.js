const { mongoose } = require('../config/db')

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  name: { type: String, default: '' },
  role: { type: Number, default: 0 },
  wechat: { type: String, default: '' },
  avatar_id: { type: String, default: '' },
  avatar_url: { type: String, default: '' },
  create_time: { type: Number, default: Date.now },
  update_time: { type: Number, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)
