const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  // we must have an imageUrl in this schema -- for db to store it
  pdfUrl: {
    type: String,
  },
});

module.exports = mongoose.model('PDF', pdfSchema);
