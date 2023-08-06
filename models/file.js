const { mongoose } = require('../config/db')

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hash: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  create_time: { type: Number, default: Date.now },
  update_time: { type: Number, default: Date.now },
})

module.exports = mongoose.model('File', FileSchema)