const express = require('express');

const {
  fileFilter,
  fileStorage,
} = require('.././upload-by-multer/multer-config');
const multer = require('multer');

module.exports = (app) => {
  app.use('/public', express.static('public'));
  // we have access to the upload folder inside the public -- so we can use it in the frontend
  // this is how we can access its files -- http://localhost:3000/public/uploads/image.css

  app.use(
    multer({
      storage: fileStorage,
      fileFilter: fileFilter,
      limits: { fileSize: 5242880 },
    }).single('image')
  );

  const { images } = require('.././upload-by-multer/image-upload.route');
  app.use('/images', images);
};
