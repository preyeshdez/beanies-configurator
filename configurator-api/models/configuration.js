const mongoose = require("mongoose");

const ConfigurationSchema =
  new mongoose.Schema({

    hash: {
      type: String,
      required: true,
      unique: true
    },

    templateSlug: {
      type: String,
      required: true
    },

    colors: {
      type: Object,
      required: true
    },

    previewUrl: {
      type: String,
      required: true
    }

  }, {
    timestamps: true
  });

module.exports =
  mongoose.model(
    "Configuration",
    ConfigurationSchema
  );