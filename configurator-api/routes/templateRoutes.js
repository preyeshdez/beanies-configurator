const express = require("express");

const router = express.Router();

const {
  getTemplates,
  getTemplateBySlug
} = require("../controllers/templateController");

router.get("/", getTemplates);

router.get("/:slug", getTemplateBySlug);

module.exports = router;