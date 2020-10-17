const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  // we must have an imageUrl in this schema -- for db to store it
  imageTitle: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

module.exports = mongoose.model('Image', imageSchema);
