const mongoose = require('mongoose')
const {Schema} = mongoose

const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url:{
    type: Number,
    required: true
  }
})

const urlModel = mongoose.model('urlModel', urlSchema)
module.exports = urlModel