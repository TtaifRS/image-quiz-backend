const express = require('express')
const { uploadImage, getImages, singleImage } = require('../controllers/imageController')
const { isAuthenticated } = require('../middlewares/Auth')
const upload = require('../middlewares/image')


const router = express.Router()

router.route('/upload').post(upload.single("image"), isAuthenticated, uploadImage)
router.route('/images').get(getImages)
router.route('/image/:id').get(singleImage)


module.exports = router