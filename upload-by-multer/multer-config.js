// Multer Configuration -- we can make it on separate module and import it here

const multer = require('multer');
const path = require('path');

// Disk Storage
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/uploads'); // images will be in the folder for the uploads
  },
  filename: (req, file, callback) => {
    callback(null, Date.now().toString() + '-' + file.originalname); //! this is for naming files --  Date Added for uniqueness
  },
});

const fileFilter = (req, files, callback) => {
  const ext = path.extname(files.originalname);
  const allowed = ['.png', '.jpg', '.jpeg', '.pdf'];
  if (allowed.includes(ext)) {
    callback(null, true);
  } else {
    callback(null, false); // handle error in middleware, not here
  }
};

// https://stackoverflow.com/questions/49482656/handling-upload-of-multiple-different-files-with-node-and-multer
//-----------------------------------

module.exports = {
  fileFilter,
  fileStorage,
};

// half part of its config is in routes.js
