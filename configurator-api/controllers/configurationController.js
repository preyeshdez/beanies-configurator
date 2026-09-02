const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const Configuration =
    require("../models/configuration");

exports.createConfiguration =
    async (req, res) => {

        try {

            const {
                templateSlug,
                colors,
                previewImage
            } = req.body;

            const hash =
                crypto
                    .createHash("sha256")
                    .update(
                        JSON.stringify({
                            templateSlug,
                            colors
                        })
                    )
                    .digest("hex");

            const existing =
                await Configuration.findOne({
                    hash
                });

            if (existing) {

                return res.json(existing);

            }

            const fileName =
                `${hash}.webp`;

            const filePath =
                path.join(
                    __dirname,
                    "../previews",
                    fileName
                );

            const base64Data =
                previewImage.replace(
                    /^data:image\/\w+;base64,/,
                    ""
                );

            fs.writeFileSync(
                filePath,
                Buffer.from(
                    base64Data,
                    "base64"
                )
            );

            const configuration =
                await Configuration.create({

                    hash,

                    templateSlug,

                    colors,

                    previewUrl:
                        `/previews/${fileName}`

                });

            res.status(201).json(
                configuration
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error:
                    "Error creando configuración"
            });

        }

    };

exports.getConfiguration =
    async (req, res) => {

        try {

            const configuration =
                await Configuration.findById(
                    req.params.id
                );

            if (!configuration) {

                return res.status(404).json({
                    error:
                        "Configuración no encontrada"
                });

            }

            res.json(configuration);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error:
                    "Error obteniendo configuración"
            });

        }

    };