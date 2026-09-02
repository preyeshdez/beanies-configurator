const Color = require("../models/color");

const getColors = async (req, res) => {

  try {

    const colors = await Color.find({
      active: true
    });

    res.json(colors);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  getColors
};