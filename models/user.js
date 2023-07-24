const { mongoose } = require('../config/db')

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  name: { type: String, default: '' },
  indentity: { type: Number, default: 0 },
  create_time: { type: Number, default: Date.now },
  update_time: { type: Number, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)
