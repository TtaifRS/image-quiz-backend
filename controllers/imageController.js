const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const Image = require('../models/images')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')


exports.uploadImage = catchAsyncError(async (req, res, next) => {
  const { name, option1, option2, option3, option4, correctAns } = req.body
  await sharp(req.file.path)
    .resize(400, 400)
    .toFile('uploads/' + 'resized-' + req.file.filename, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        const saveImage = Image({
          name,
          option1,
          option2,
          option3,
          option4,
          correctAns,
          img: {
            data: fs.readFileSync('uploads/' + 'resized-' + req.file.filename),
            contentType: req.file.mimetype,
          },
        });
        saveImage.save()




        fs.unlink('uploads/' + req.file.filename, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('OG File removed');
        });

        fs.unlink('uploads/' + 'resized-' + req.file.filename, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('Resize File removed');
        });
        res.status(200).json({
          image: saveImage,

        })
      }
    });




})

exports.getImages = catchAsyncError(async (req, res) => {
  const Images = await Image.find().select('img')

  res.status(200).json({
    success: true,
    images: Images
  })
})

exports.singleImage = catchAsyncError(async (req, res) => {
  const image = await Image.findById(req.params.id)

  res.status(200).json({
    success: true,
    data: image
  })
})