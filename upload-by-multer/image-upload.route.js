const express = require('express');
const router = express.Router();
const ImagesModel = require('./image-upload.model');
const PDF = require('./pdf-upload.model');
const fs = require('fs');
const path = require('path');

//Auth
const Auth = require('.././graphql/models/auth');
const jwt = require('jsonwebtoken');

const PDFDocument = require('pdfkit'); // for generating pdf's

// ! Getting All URLs
router.get('/', async (req, res) => {
  //? Here we could do that, when creating images, we could store userId in that image model, so we may retrieve images of a userId in a single query
  if (!req.userId) throw new Error('Unauthorized User');

  // getting user's assigned images only
  const user = await Auth.findOne({ _id: req.userId });

  const images = await ImagesModel.find({
    _id: {
      $in: user.images,
    },
  });

  res.send(images);
});
// ! Getting All  PDFS
router.get('/pdf', async (req, res) => {
  //? Here we could do that, when creating pdfs, we could store userId in that image model, so we may retrieve pdfs of a userId in a single query

  if (!req.userId) throw new Error('Unauthorized User');

  // getting user's assigned images only
  const user = await Auth.findOne({ _id: req.userId });

  const pdfs = await PDF.find({
    _id: {
      $in: user.pdfs,
    },
  });

  res.send(pdfs);
});

// Note .. I can apply Auth in the routes .. so logged in users can post something or retrieve something
// we can have a userId from the frontend and then we can retrieve information of the user and his pdf files or images .

//! uploading single image or single pdf -- its configuration in startup folder -> routes
router.post('/', async (req, res) => {
  if (!req.userId) throw new Error('Unauthorized User');

  const file = req.file;
  if (!file) return console.log('File is Undefined or null');

  const ext = path.extname(file.originalname);
  const allowed = ['.png', '.jpg', '.jpeg'];

  if (allowed.includes(ext)) {
    const imageUrl = file.path;
    //   image title is not required here .. i can work on it later
    const imageTitle = req.body.title;

    let newImage = new ImagesModel({
      imageTitle,
      imageUrl: imageUrl,
    });

    newImage = await newImage.save();

    // assigning this image to authorized user .
    const user = await Auth.findOne({ _id: req.userId });
    user.images = [...user.images, newImage._id];
    user.save();

    res.send('Image is saved ');
  } else if (ext.includes('pdf')) {
    //! through this process, i have saved user created pdfs , now in the frontend , i can get all the pdf urls by creating some get route here
    //! then i can create multiple href links according to the length of pdfs array and use the pdf urls there
    const pdfUrl = file.path;

    let newPdf = new PDF({
      pdfUrl,
    });
    newPdf = await newPdf.save();

    // assigning this pdf to authorized user .
    const user = await Auth.findOne({ _id: req.userId });
    user.pdfs = [...user.pdfs, newPdf._id];
    user.save();

    res.send('PDF is saved');
  }
  // res.send(null);
});

//!                    Downloading images or files (pdf invoices) specifically for the users

router.get('/pdf-show/:name', async (req, res) => {
  // we are receiving name of the pdf, which is stored in db, so we may go to that image
  const invoicePath = path.join('public', 'uploads', req.params.name);
  const file = fs.createReadStream(invoicePath); //  fs will read the path and file

  res.setHeader('Content-Type', 'application/pdf'); // extension of pdf

  // For Downloading pdf file
  // res.setHeader(
  //   "Content-Disposition",
  //   'attachment; filename="' + invoiceName + ""
  // );

  // For Inline Open Tab for pdf
  res.setHeader(
    'Content-Disposition',
    'inline; filename="' + req.params.name + ''
  );

  file.pipe(res);
});

//! I can assign any pdf to some section, where all the students of that section will be able to see that

//                                            ! Generate PDF's

//? This will be generated at the spot and it may take time in generation due to connection and it will be stored in the invoices folder

router.get('/pdf-generate/:token', async (req, res) => {
  // we are not accessing this request using axios but href tag, we can't send headers with that,
  // so i sent token filhaal, to access user's data
  let decodedToken;
  try {
    decodedToken = jwt.verify(req.params.token, 'secret');
  } catch (error) {
    throw new Error(error);
  }

  const userId = decodedToken.user_id; // it will only be id without pdf extension
  // here im using image id.
  // we can have a user id and auth here -- so we can serve authenticated or logged in users

  // choose a different name than the one manually added .
  const invoiceName = 'invoice-generated-' + userId + '.pdf';
  //   naming the invoice .. but it will not be stored
  const invoicePath = path.join('public', 'invoices', invoiceName);
  // invoice path becomes public/invoices/invoiceName -- which is the actual address where invoice is located at .. (actual address of invoice -- in this vsCode File)

  const pdfDoc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf'); // extension of pdf

  // For Downloading pdf file
  // res.setHeader(
  //   'Content-Disposition',
  //   'attachment; filename="' + invoiceName + ''
  // );

  // For Inline Open Tab for pdf
  res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '');

  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  // getting user's assigned images only
  const user = await Auth.findOne({ _id: decodedToken.user_id });
  const images = await ImagesModel.find({
    _id: {
      $in: user.images,
    },
  });

  // Here we are writing and  styling pdf .. i can learn more on the official docs

  pdfDoc.fontSize(26).text('invoice', {
    underline: true,
  }); // 1st line

  pdfDoc.text('--------------------------------');

  // i can make a bill of any data .. as im getting data of images here
  images.forEach((image) => {
    pdfDoc.fontSize(12).text(image.imageUrl + ' - ' + image.imageUrl); // so we can add information here from the database
  });

  pdfDoc.text('--------------------------------');
  pdfDoc.text('--------------------------------');
  pdfDoc.text('--------------------------------');
  pdfDoc.text('This is generated One Last ');

  pdfDoc.fontSize(15).text('Total Bill is : $ ' + 12);

  pdfDoc.end(); // ending the writing
});

//! Now deleting the product -- as well as .. image from the files and db
router.delete('/delete-the-image/:id', async (req, res) => {
  // Remember!! -- deleting image from files 1st and then delete from database

  // 1st of all .. we will find image url in the database
  const image = await ImagesModel.findById(req.params.id);
  const filePath = image.imageUrl;

  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });

  // after deleting image from here // we will update database so frontend will refresh
  await ImagesModel.findByIdAndDelete(req.params.id);
});

exports.images = router;
