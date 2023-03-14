const multer = require('multer')
const fs = require('fs')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

module.exports = upload