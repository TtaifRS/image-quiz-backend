const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  name: {
    type: String
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  option1: {
    type: String
  },
  option2: {
    type: String
  },
  option3: {
    type: String
  },
  option4: {
    type: String
  },
  correctAns: {
    type: String
  }
})

module.exports = mongoose.model("Image", imageSchema)