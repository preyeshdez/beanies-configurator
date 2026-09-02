const crypto = require("crypto");
const { put } = require("@vercel/blob");

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


            // GENERAR HASH ÚNICO

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


            // VERIFICAR SI YA EXISTE

            const existing =
                await Configuration.findOne({
                    hash
                });

            if (existing) {

                return res.json(existing);

            }


            // CONVERTIR BASE64 A BUFFER

            const base64Data =
                previewImage.replace(
                    /^data:image\/\w+;base64,/,
                    ""
                );

            const buffer =
                Buffer.from(
                    base64Data,
                    "base64"
                );


            // GUARDAR PREVIEW EN VERCEL BLOB

            const blob =
                await put(
                    `previews/${hash}.webp`,
                    buffer,
                    {
                        access: "public",
                        contentType: "image/webp",
                        addRandomSuffix: false
                    }
                );


            // GUARDAR CONFIGURACIÓN EN MONGODB

            const configuration =
                await Configuration.create({

                    hash,

                    templateSlug,

                    colors,

                    previewUrl:
                        blob.url

                });


            res.status(201).json(
                configuration
            );


        } catch (error) {

            console.error(
                "Error creando configuración:",
                error
            );

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