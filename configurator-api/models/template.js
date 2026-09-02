const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true
  },

  label: {
    type: String,
    required: true
  },

  mask: {
    type: String,
    required: true
  }

});

const templateSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  category: {
    type: String,
    default: "beanie"
  },

  baseImage: {
    type: String,
    required: true
  },

  zones: [zoneSchema]

},
{
  timestamps: true
});

module.exports = mongoose.model(
  "Template",
  templateSchema
);