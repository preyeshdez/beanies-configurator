const Template = require("../models/template");

const getTemplates = async (req, res) => {

  try {

    const templates = await Template.find();

    res.json(templates);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const getTemplateBySlug = async (req, res) => {

  try {

    const template = await Template.findOne({
      slug: req.params.slug
    });

    if (!template) {

      return res.status(404).json({
        message: "Template no encontrado"
      });

    }

    res.json(template);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  getTemplates,
  getTemplateBySlug
};