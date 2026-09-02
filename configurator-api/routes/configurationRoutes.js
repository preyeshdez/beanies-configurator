const express =
    require("express");

const router =
    express.Router();

const {
    createConfiguration,
    getConfiguration
} = require(
    "../controllers/configurationController"
);

router.post(
    "/",
    createConfiguration
);

router.get(
    "/:id",
    getConfiguration
);

// test

router.get("/test", (req, res) => {

    res.json({
        ok: true
    });

});

const Configuration =
    require("../models/Configuration");

router.get("/", async (req, res) => {

    const configs =
        await Configuration.find();

    res.json(configs);

});

module.exports =
    router;